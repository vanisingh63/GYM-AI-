🏋️ Gym AI Onboarding System
A full-stack AI-powered onboarding system for gyms. New members fill a short form and instantly receive a personalised diet + workout plan — delivered straight to their WhatsApp, with a 24/7 AI fitness coach they can text anytime.
Built as a productised automation system for selling AI + automation services to local gyms.
🔗 Live demo:https://gym-ai-kohl.vercel.app/

✨ What it does

A new gym member fills a 3-step onboarding form (goals, food preference, fitness level, schedule)
Their answers are sent to an AI model (Llama 3.3 70B via Groq) which generates a personalised diet plan and workout schedule
The plan is sent automatically to the member's WhatsApp within seconds — no staff involvement
The member can reply to the WhatsApp message anytime with a question and get an instant, personalised answer based on their profile


🧱 Tech stack
LayerTechFrontendReact + Vite, deployed on VercelBackendNode.js + Express, deployed on RenderAIGroq API — llama-3.3-70b-versatileMessagingTwilio WhatsApp APIStylingPlain CSS

🔄 How it works
Member fills onboarding form (React) leads to a POST request to /api/generate-plan-whatsapp. The backend calls Groq to generate a diet and workout plan, then sends it to the member's WhatsApp via Twilio as three messages: welcome, diet, and workout. The member's profile is saved in memory. When the member replies on WhatsApp with a question, Twilio sends it to the /api/whatsapp-webhook endpoint, which builds a prompt using the member's saved profile plus their question, and Groq generates a personalised reply that gets sent back via WhatsApp.

🚀 Getting started
1. Clone the repo
git clone https://github.com/vanisingh63/GYM-AI-.git
cd GYM-AI-/gym-ai-onboarding
2. Set up the backend
cd backend
cp .env.example .env
Fill in .env with your GROQ_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and PORT=3001.
Get a free Groq key at console.groq.com and Twilio credentials at console.twilio.com
npm install
node server.js
3. Set up the frontend
cd ../frontend
npm install
npm run dev
Open http://localhost:5173
4. Connect WhatsApp (Twilio Sandbox)
In Twilio Console go to Messaging → Try it out → Send a WhatsApp message, send "join your-sandbox-code" to the Twilio number from your phone, then go to Sandbox settings and set "When a message comes in" to your backend URL plus /api/whatsapp-webhook

🔌 API endpoints

POST /api/generate-plan — Generates a plan, returns it in the response (used for in-browser demo)
POST /api/generate-plan-whatsapp — Generates a plan AND sends it to the member's WhatsApp
POST /api/whatsapp-webhook — Twilio webhook that receives incoming WhatsApp replies and responds with AI


⚠️ Known limitations
Member profiles are stored in memory and reset if the backend restarts — a production version would use a database. WhatsApp delivery uses the Twilio Sandbox, which requires each tester to join via a join code; a production deployment would use a verified WhatsApp Business number.

🗺️ Roadmap
This onboarding flow is one piece of a larger gym automation stack including membership renewal reminders, weekly check-ins where AI adjusts plans based on progress, a re-engagement flow for inactive members, review request automation, and a Make/Airtable layer to manage member data at scale.

License
MIT
