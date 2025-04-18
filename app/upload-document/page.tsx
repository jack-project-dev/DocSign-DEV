import AuthCheck from "@/components/auth-check"
import AppHeader from "@/components/app-header"
import DocumentUploader from "@/components/document-uploader"

export default function UploadDocumentPage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
              <p className="text-gray-600 mt-2">
                Upload a document you want to sign. We support PDF and Word documents.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <DocumentUploader />
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}
