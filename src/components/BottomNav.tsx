import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            <NavLink
              to="/planning"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                  isActive ? 'text-[#FB7185]' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 0 : 1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>Planning</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/beneficiaires"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                  isActive ? 'text-[#FB7185]' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 0 : 1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>Bénéficiaires</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/dashboard"
              className="flex flex-col items-center -mt-4"
            >
              {({ isActive }) => (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] shadow-xl shadow-[#FB7185]/30' 
                    : 'bg-slate-100 shadow-lg'
                }`}>
                  <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
              )}
            </NavLink>

            <NavLink
              to="/carnet"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                  isActive ? 'text-[#FB7185]' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 0 : 1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>Carnet</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/profil"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                  isActive ? 'text-[#FB7185]' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 0 : 1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>Profil</span>
                </>
              )}
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
  )
}