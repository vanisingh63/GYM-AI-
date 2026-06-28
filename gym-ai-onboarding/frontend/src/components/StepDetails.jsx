import OptionGrid from './OptionGrid'

const AGE_OPTIONS = [
  { value: 'under-20', label: 'Under 20' },
  { value: '20-30', label: '20 – 30' },
  { value: '30-40', label: '30 – 40' },
  { value: '40+', label: '40+' },
]

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not', label: 'Prefer not to say' },
]

export default function StepDetails({ data, onChange, onNext }) {
  const isValid = data.name.trim() && data.age && data.gender

  return (
    <>
      <h2>Let's get started 👋</h2>
      <p className="subtitle">Tell us a bit about yourself so we can personalise your experience.</p>

      <label>First name</label>
      <input
        type="text"
        placeholder="e.g. Arjun"
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        autoFocus
      />

      <label>Age group</label>
      <OptionGrid options={AGE_OPTIONS} value={data.age} onChange={(v) => onChange('age', v)} />

      <label>Gender</label>
      <OptionGrid options={GENDER_OPTIONS} value={data.gender} onChange={(v) => onChange('gender', v)} />

      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Next →
      </button>
    </>
  )
}
