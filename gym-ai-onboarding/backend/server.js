require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Groq = require('groq-sdk')
const twilio = require('twilio')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // needed for Twilio webhooks

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'

const memberProfiles = {}

function buildPlanPrompt(d) {
  return `You are a certified fitness coach and nutritionist for an Indian gym called FitZone.
Create a personalised onboarding plan for this new member:

Name: ${d.name}
Age group: ${d.age}
Gender: ${d.gender}
Goal: ${d.goal}
Food preference: ${d.food}
Allergies/restrictions: ${d.allergies || 'none'}
Fitness level: ${d.level}
Days available per week: ${d.days}
Injuries/limitations: ${d.injuries || 'none'}

Respond in EXACTLY this format:

WELCOME:
Write 2 warm sentences welcoming them by first name and referencing their goal.

DIET PLAN:
Write a practical 3-day sample meal plan (Day 1, Day 2, Day 3).
Each day: Breakfast, Mid-morning snack, Lunch, Evening snack, Dinner.
Use common Indian foods.

WORKOUT PLAN:
Write a weekly workout schedule suited to their fitness level and available days.
Include specific exercises with sets and reps.`
}

function buildChatPrompt(profile, question) {
  return `You are a friendly, knowledgeable fitness coach AI for FitZone gym, chatting with a member on WhatsApp.

Member profile:
Name: ${profile.name}
Goal: ${profile.goal}
Food preference: ${profile.food}
Fitness level: ${profile.level}
Allergies: ${profile.allergies || 'none'}
Injuries: ${profile.injuries || 'none'}

The member just asked: "${question}"

Reply in a short, WhatsApp-style message (2-4 sentences max). Be warm, specific to their profile, and practical. No markdown formatting, just plain text suitable for a text message.`
}

app.post('/api/generate-plan', async (req, res) => {
  const data = req.body
  if (!data.name || !data.goal || !data.food || !data.level || !data.days) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPlanPrompt(data) }],
    })
    const plan = completion.choices[0].message.content
    res.json({ plan })
  } catch (err) {
    console.error('Groq API error:', err.message)
    res.status(500).json({ error: 'Failed to generate plan.' })
  }
})

app.post('/api/generate-plan-whatsapp', async (req, res) => {
  const data = req.body
  if (!data.name || !data.goal || !data.food || !data.level || !data.days || !data.phone) {
    return res.status(400).json({ error: 'Missing required fields (phone number needed)' })
  }

  let phone = data.phone.replace(/\s+/g, '')
  if (!phone.startsWith('+')) phone = '+91' + phone.replace(/^0+/, '')
  const whatsappTo = `whatsapp:${phone}`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPlanPrompt(data) }],
    })
    const planText = completion.choices[0].message.content

    memberProfiles[whatsappTo] = { ...data }

    const welcome = (planText.match(/WELCOME:\s*([\s\S]*?)(?=DIET PLAN:|$)/i)?.[1] || '').trim()
    const diet = (planText.match(/DIET PLAN:\s*([\s\S]*?)(?=WORKOUT PLAN:|$)/i)?.[1] || '').trim()
    const workout = (planText.match(/WORKOUT PLAN:\s*([\s\S]*?)$/i)?.[1] || '').trim()

    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: whatsappTo,
      body: `🎉 ${welcome}`,
    })
    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: whatsappTo,
      body: `🥗 *Your Diet Plan*\n\n${diet}`,
    })
    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: whatsappTo,
      body: `🏋️ *Your Workout Plan*\n\n${workout}\n\nReply anytime with a question — I'm here 24/7!`,
    })

    res.json({ plan: planText, sentTo: phone })
  } catch (err) {
    console.error('Error generating/sending plan:', err.message)
    res.status(500).json({ error: 'Failed to generate or send plan: ' + err.message })
  }
})

app.post('/api/whatsapp-webhook', async (req, res) => {
  const from = req.body.From
  const incomingMsg = req.body.Body

  const twiml = new twilio.twiml.MessagingResponse()
  const profile = memberProfiles[from]

  if (!profile) {
    twiml.message("Hey! I don't have your profile yet. Please complete the onboarding form first so I can help you better 💪")
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    return res.end(twiml.toString())
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [{ role: 'user', content: buildChatPrompt(profile, incomingMsg) }],
    })
    const reply = completion.choices[0].message.content
    twiml.message(reply)
  } catch (err) {
    console.error('Chat error:', err.message)
    twiml.message("Sorry, I'm having trouble right now. Try again in a bit!")
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

app.get('/', (req, res) => res.send('Gym AI backend is running ✅'))

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})