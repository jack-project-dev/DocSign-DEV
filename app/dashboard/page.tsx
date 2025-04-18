"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import DocumentUpload from "@/components/document-upload"
import SignatureUpload from "@/components/signature-upload"

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [documentUploaded, setDocumentUploaded] = useState(false)
  const [signatureUploaded, setSignatureUploaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)

      // Check if document and signature are uploaded
      const docStatus = localStorage.getItem("documentUploaded")
      const sigStatus = localStorage.getItem("signatureUploaded")

      setDocumentUploaded(docStatus === "true")
      setSignatureUploaded(sigStatus === "true")
    }
  }, [router])

  useEffect(() => {
    // If both document and signature are uploaded, redirect to sign document page
    if (documentUploaded && signatureUploaded) {
      router.push("/sign-document")
    }
  }, [documentUploaded, signatureUploaded, router])

  if (!isAuthenticated) {
    return null // Don't render anything while checking auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Document Signing Dashboard</h1>

        {!documentUploaded ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 1: Upload Your Document</CardTitle>
              <CardDescription>
                First, upload the document you want to sign. Supported formats: PDF, DOC, DOCX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUpload onUploadComplete={() => setDocumentUploaded(true)} />
            </CardContent>
          </Card>
        ) : !signatureUploaded ? (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Upload Your Signature</CardTitle>
              <CardDescription>
                Now, upload your signature as a PNG image. This will be used to sign your document.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignatureUpload onUploadComplete={() => setSignatureUploaded(true)} />
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  )
}
