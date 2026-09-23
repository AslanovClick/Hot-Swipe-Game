interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track"><span className="toggle-knob" /></span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  )
}
