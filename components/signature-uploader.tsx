"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SignatureUploader() {
  const [signature, setSignature] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [documentName, setDocumentName] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if document is uploaded
    const docName = localStorage.getItem("documentName")
    const docUploaded = localStorage.getItem("documentUploaded")

    if (!docUploaded || !docName) {
      toast({
        title: "No document found",
        description: "Please upload a document first",
        variant: "destructive",
      })
      router.push("/upload-document")
    } else {
      setDocumentName(docName)
    }
  }, [router, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if file is PNG
      if (selectedFile.type === "image/png") {
        setSignature(selectedFile)

        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG image for your signature",
          variant: "destructive",
        })
      }
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(100)

      // Store signature info
      if (previewUrl) {
        localStorage.setItem("signatureUrl", previewUrl)
        localStorage.setItem("signatureUploaded", "true")

        toast({
          title: "Signature uploaded",
          description: "Your signature has been uploaded successfully",
        })
      }
    }, 2000)
  }

  const handleNext = () => {
    router.push("/sign-document")
  }

  return (
    <div className="space-y-6">
      {documentName && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Document: <span className="font-medium text-gray-900">{documentName}</span>
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
        {previewUrl ? (
          <div className="text-center w-full">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 max-w-xs mx-auto">
              <img src={previewUrl || "/placeholder.svg"} alt="Signature preview" className="max-h-32 mx-auto" />
            </div>
            <p className="text-lg font-medium">{signature?.name}</p>

            {uploadProgress === 100 ? (
              <div className="mt-4 text-green-600 font-medium">Upload complete</div>
            ) : isUploading ? (
              <div className="w-full mt-4">
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-sm text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <div className="mt-4 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSignature(null)
                    setPreviewUrl(null)
                    setUploadProgress(0)
                  }}
                >
                  Remove
                </Button>
                <Button size="sm" onClick={simulateUpload}>
                  Upload
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500 mb-2">Drag and drop your signature image here, or</p>
            <label htmlFor="signature-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-primary underline">browse files</span>
              <input
                id="signature-upload"
                type="file"
                className="sr-only"
                accept=".png,image/png"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Supported format: PNG only</p>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={uploadProgress !== 100} className="flex items-center">
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
