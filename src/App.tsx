import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BeneficiairesPage from './pages/BeneficiairesPage'
import NouveauBeneficiairePage from './pages/NouveauBeneficiairePage'
import BeneficiairePage from './pages/BeneficiairePage'
import PlanningPage from './pages/PlanningPage'
import PlanningGlobalPage from './pages/PlanningGlobalPage'
import CarnetPage from './pages/CarnetPage'
import CarnetGlobalPage from './pages/CarnetGlobalPage'
import DevisPage from './pages/DevisPage'
import ContratPage from './pages/ContratPage'
import ProfilEditPage from './pages/ProfilEditPage'
import ProfilPublicPage from './pages/ProfilPublicPage'
import BadgesPage from './pages/BadgesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/profil/public" element={<ProfilPublicPage />} />

        {/* Protégé */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/beneficiaires" element={<ProtectedRoute><BeneficiairesPage /></ProtectedRoute>} />
        <Route path="/beneficiaires/nouveau" element={<ProtectedRoute><NouveauBeneficiairePage /></ProtectedRoute>} />
        <Route path="/beneficiaires/:id" element={<ProtectedRoute><BeneficiairePage /></ProtectedRoute>} />
        <Route path="/beneficiaires/:id/planning" element={<ProtectedRoute><PlanningPage /></ProtectedRoute>} />
        <Route path="/beneficiaires/:id/carnet" element={<ProtectedRoute><CarnetPage /></ProtectedRoute>} />
        <Route path="/planning" element={<ProtectedRoute><PlanningGlobalPage /></ProtectedRoute>} />
        <Route path="/carnet" element={<ProtectedRoute><CarnetGlobalPage /></ProtectedRoute>} />
        <Route path="/devis" element={<ProtectedRoute><DevisPage /></ProtectedRoute>} />
        <Route path="/contrat" element={<ProtectedRoute><ContratPage /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><ProfilEditPage /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App