export default function OptionGrid({ options, value, onChange }) {
  return (
    <div className="opt-grid">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`opt-btn ${value === opt.value ? 'selected' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.emoji && <span style={{ marginRight: 4 }}>{opt.emoji}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
