interface ParameterSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  description?: string
}

export default function ParameterSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  description,
}: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-700">{label}</label>
        <span className="text-primary-600 font-semibold">{value}</span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
      />
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

