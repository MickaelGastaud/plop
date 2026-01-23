import AuthForm from '../components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-teal-700 mb-8">
        🏠 CeSuCare
      </h1>
      <AuthForm />
    </div>
  )
}