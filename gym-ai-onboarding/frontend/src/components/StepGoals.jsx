import OptionGrid from './OptionGrid'

const GOAL_OPTIONS = [
  { value: 'lose-weight', label: 'Lose weight', emoji: '🔥' },
  { value: 'build-muscle', label: 'Build muscle', emoji: '💪' },
  { value: 'stay-fit', label: 'Stay fit', emoji: '🧘' },
  { value: 'improve-stamina', label: 'Improve stamina', emoji: '🏃' },
]

const FOOD_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
  { value: 'non-vegetarian', label: 'Non-veg', emoji: '🍗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚' },
]

export default function StepGoals({ data, onChange, onNext, onBack }) {
  const isValid = data.goal && data.food

  return (
    <>
      <h2>Your goals 🎯</h2>
      <p className="subtitle">This shapes your diet plan and all the messages you'll receive.</p>

      <label>Main fitness goal</label>
      <OptionGrid options={GOAL_OPTIONS} value={data.goal} onChange={(v) => onChange('goal', v)} />

      <label>Food preference</label>
      <OptionGrid options={FOOD_OPTIONS} value={data.food} onChange={(v) => onChange('food', v)} />

      <label>Allergies or foods to avoid <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span></label>
      <input
        type="text"
        placeholder="e.g. no dairy, no nuts"
        value={data.allergies}
        onChange={(e) => onChange('allergies', e.target.value)}
      />

      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Next →
      </button>
      <button className="btn-secondary" onClick={onBack}>
        ← Back
      </button>
    </>
  )
}
