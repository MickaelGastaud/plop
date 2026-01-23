import Tooltip from './Tooltip'

interface ChampProps {
  label: string
  value: string
  onChange: (v: string) => void
  tooltip: string
  example?: string
  type?: string
  placeholder?: string
}

export default function Champ({ 
  label, 
  value, 
  onChange, 
  tooltip, 
  example,
  type = 'text',
  placeholder = ''
}: ChampProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <Tooltip text={tooltip} example={example} />
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      />
    </div>
  )
}