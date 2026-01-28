import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
  hideNav?: boolean // Pour certaines pages comme les formulaires plein écran
}

export default function Layout({ children, hideNav = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      {!hideNav && <BottomNav />}
    </div>
  )
}