import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import BeneficiairesPage from './pages/BeneficiairesPage'
import NouveauBeneficiairePage from './pages/NouveauBeneficiairePage'
import BeneficiaireDetailPage from './pages/BeneficiaireDetailPage'
import PlanningPage from './pages/PlanningPage'
import PlanningGlobalPage from './pages/PlanningGlobalPage'
import CarnetPage from './pages/CarnetPage'
import CarnetGlobalPage from './pages/CarnetGlobalPage'
import DevisPage from './pages/DevisPage'
import ContratPage from './pages/ContratPage'
import ProfilEditPage from './pages/ProfilEditPage'
import ProfilPublicPage from './pages/ProfilPublicPage'
import BadgesPage from './pages/BadgesPage'
import DocumentsPage from './pages/DocumentsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/profil/public" element={<ProfilPublicPage />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protégé */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        {/* Bénéficiaires */}
        <Route path="/beneficiaires" element={<ProtectedRoute><BeneficiairesPage /></ProtectedRoute>} />
        <Route path="/beneficiaires/nouveau" element={<ProtectedRoute><NouveauBeneficiairePage /></ProtectedRoute>} />
        <Route path="/beneficiaires/:id" element={<ProtectedRoute><BeneficiaireDetailPage /></ProtectedRoute>} />
        <Route path="/beneficiaires/:id/planning" element={<ProtectedRoute><PlanningPage /></ProtectedRoute>} />
        <Route path="/beneficiaires/:id/carnet" element={<ProtectedRoute><CarnetPage /></ProtectedRoute>} />
        
        {/* Planning & Carnet global */}
        <Route path="/planning" element={<ProtectedRoute><PlanningGlobalPage /></ProtectedRoute>} />
        <Route path="/carnet" element={<ProtectedRoute><CarnetGlobalPage /></ProtectedRoute>} />
        
        {/* Documents */}
        <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
        <Route path="/devis" element={<ProtectedRoute><DevisPage /></ProtectedRoute>} />
        <Route path="/contrat" element={<ProtectedRoute><ContratPage /></ProtectedRoute>} />
        
        {/* Profil */}
        <Route path="/profil" element={<ProtectedRoute><ProfilEditPage /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App