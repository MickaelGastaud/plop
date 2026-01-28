import { useState } from 'react'

interface Props {
  text: string
  example?: string
}

export default function TooltipBilingue({ text, example }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  if (!text) return null

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 text-xs font-bold hover:bg-teal-200 transition inline-flex items-center justify-center"
      >
        ?
      </button>
      
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Bulle d'info */}
          <div className="absolute z-50 left-0 top-7 w-64 p-3 bg-gray-900 text-white text-sm rounded-xl shadow-xl animate-fadeIn">
            <p className="leading-relaxed">{text}</p>
            {example && (
              <p className="mt-2 text-teal-300 text-xs">
                💡 {example}
              </p>
            )}
            {/* Flèche */}
            <div className="absolute -top-2 left-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900" />
          </div>
        </>
      )}
    </span>
  )
}