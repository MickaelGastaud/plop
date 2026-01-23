import { useState } from 'react'

interface TooltipProps {
  text: string
  example?: string
}

export default function Tooltip({ text, example }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold hover:bg-teal-200 transition"
      >
        i
      </button>
      
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl">
          <p>{text}</p>
          {example && (
            <p className="mt-2 text-teal-300 text-xs">
              💡 Exemple : {example}
            </p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  )
}