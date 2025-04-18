import AuthCheck from "@/components/auth-check"
import AppHeader from "@/components/app-header"
import SignatureUploader from "@/components/signature-uploader"

export default function UploadSignaturePage() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Upload Signature</h1>
              <p className="text-gray-600 mt-2">
                Upload your signature as a PNG image. This will be used to sign your document.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <SignatureUploader />
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}
