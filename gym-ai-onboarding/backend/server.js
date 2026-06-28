require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Groq = require('groq-sdk')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function buildPrompt(d) {
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

app.post('/api/generate-plan', async (req, res) => {
  const data = req.body
  if (!data.name || !data.goal || !data.food || !data.level || !data.days) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    const completion = await groq.chat.completions.create({
      model:'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPrompt(data) }],
    })
    const plan = completion.choices[0].message.content
    res.json({ plan })
  } catch (err) {
    console.error('Groq API error:', err.message)
    res.status(500).json({ error: 'Failed to generate plan.' })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})