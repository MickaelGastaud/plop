import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { useProfil } from '../store/useProfil'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth()
  const { profil } = useProfil()

  // Pas connecté → Login
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Connecté mais onboarding pas fait → Onboarding
  if (!profil.onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  // Tout bon → Afficher la page
  return <>{children}</>
}