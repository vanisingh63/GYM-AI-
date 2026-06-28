export default function StepIndicator({ current, total }) {
  return (
    <div className="steps">
      {Array.from({ length: total }).map((_, i) => (
        <>
          <div
            key={`dot-${i}`}
            className={`step-dot ${i + 1 === current ? 'active' : i + 1 < current ? 'done' : ''}`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div key={`line-${i}`} className={`step-line ${i + 1 < current ? 'done' : ''}`} />
          )}
        </>
      ))}
    </div>
  )
}
