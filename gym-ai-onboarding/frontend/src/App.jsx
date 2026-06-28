import { useState } from 'react'
import StepIndicator from './components/StepIndicator'
import StepDetails from './components/StepDetails'
import StepGoals from './components/StepGoals'
import StepFitness from './components/StepFitness'
import PlanResult from './components/PlanResult'

const INITIAL_DATA = {
  name: '', age: '', gender: '',
  goal: '', food: '', allergies: '',
  level: '', days: '', injuries: '',
}

const GEN_STATUSES = [
  'Analysing your profile...',
  'Crafting your diet plan...',
  'Building your workout schedule...',
  'Personalising recommendations...',
  'Almost done...',
]

function parsePlan(text) {
  const welcome = (text.match(/WELCOME:\s*([\s\S]*?)(?=DIET PLAN:|$)/i)?.[1] || '').trim()
  const diet = (text.match(/DIET PLAN:\s*([\s\S]*?)(?=WORKOUT PLAN:|$)/i)?.[1] || '').trim()
  const workout = (text.match(/WORKOUT PLAN:\s*([\s\S]*?)$/i)?.[1] || '').trim()
  return { welcome, diet, workout }
}

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_DATA)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [genStatus, setGenStatus] = useState('')
  const [error, setError] = useState('')

  const update = (key, val) => setData((d) => ({ ...d, [key]: val }))

  const generate = async () => {
    setLoading(true)
    setError('')
    setStep(4)

    let i = 0
    setGenStatus(GEN_STATUSES[0])
    const iv = setInterval(() => {
      i = (i + 1) % GEN_STATUSES.length
      setGenStatus(GEN_STATUSES[i])
    }, 1800)

    try {
      const res = await fetch('https://gym-ai-5sbs.onrender.com/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Server error')
      setPlan(parsePlan(json.plan))
      setStep(5)
    } catch (err) {
      setError(err.message)
      setStep(3)
    } finally {
      clearInterval(iv)
      setLoading(false)
    }
  }

  const restart = () => {
    setData(INITIAL_DATA)
    setPlan(null)
    setError('')
    setStep(1)
  }

  return (
    <div className="card">
      <div className="gym-logo">⚡ FitZone</div>
      {step < 4 && <StepIndicator current={step} total={3} />}
      {step === 1 && (
        <StepDetails data={data} onChange={update} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <StepGoals data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <>
          <StepFitness data={data} onChange={update} onSubmit={generate} onBack={() => setStep(2)} loading={loading} />
          {error && (
            <p style={{ marginTop: '1rem', fontSize: 13, color: '#dc2626', background: '#fef2f2', padding: '10px 14px', borderRadius: 8 }}>
              {error} — please try again.
            </p>
          )}
        </>
      )}
      {step === 4 && (
        <div className="generating">
          <div className="spinner" />
          <h2>Generating your plan...</h2>
          <p className="gen-status">{genStatus}</p>
        </div>
      )}
      {step === 5 && plan && (
        <PlanResult plan={plan} name={data.name} onRestart={restart} />
      )}
    </div>
  )
}