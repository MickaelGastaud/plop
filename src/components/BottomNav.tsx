import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Accueil' },
  { to: '/planning', icon: '📅', label: 'Planning' },
  { to: '/beneficiaires', icon: '👥', label: 'Bénéficiaires' },
  { to: '/documents', icon: '📄', label: 'Documents' },
  { to: '/profil', icon: '👤', label: 'Profil' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? 'text-teal-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-2xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </span>
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-teal-500 rounded-b-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}