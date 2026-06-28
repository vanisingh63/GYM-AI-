import OptionGrid from './OptionGrid'

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', emoji: '⚡' },
  { value: 'advanced', label: 'Advanced', emoji: '🔥' },
  { value: 'not-sure', label: "Not sure", emoji: '🤷' },
]

const DAYS_OPTIONS = [
  { value: '2-3', label: '2–3 days' },
  { value: '4-5', label: '4–5 days' },
  { value: '6', label: '6 days' },
  { value: '7', label: 'Every day' },
]

export default function StepFitness({ data, onChange, onSubmit, onBack, loading }) {
  const isValid = data.level && data.days

  return (
    <>
      <h2>Fitness & schedule 🏋️</h2>
      <p className="subtitle">We'll build a workout plan that fits your level and schedule.</p>

      <label>Current fitness level</label>
      <OptionGrid options={LEVEL_OPTIONS} value={data.level} onChange={(v) => onChange('level', v)} />

      <label>Days available per week</label>
      <OptionGrid options={DAYS_OPTIONS} value={data.days} onChange={(v) => onChange('days', v)} />

      <label>Injuries or limitations <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span></label>
      <input
        type="text"
        placeholder="e.g. bad knees, lower back pain"
        value={data.injuries}
        onChange={(e) => onChange('injuries', e.target.value)}
      />

      <button className="btn-primary" onClick={onSubmit} disabled={!isValid || loading}>
        {loading ? 'Generating...' : 'Generate my plan ✨'}
      </button>
      <button className="btn-secondary" onClick={onBack} disabled={loading}>
        ← Back
      </button>
    </>
  )
}
