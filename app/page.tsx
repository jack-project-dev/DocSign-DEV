import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">DocSign</h1>
          <p className="mt-2 text-gray-600">Sign documents securely and efficiently</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
