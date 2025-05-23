import AuthCheck from "@/components/auth-check"
import AppHeader from "@/components/app-header"
import DocumentSigner from "@/components/document-signer"

export default function SignDocumentPage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Sign Document</h1>
              <p className="text-gray-600 mt-2">
                Place signature boxes where you want your signature to appear on the document.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <DocumentSigner />
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}
