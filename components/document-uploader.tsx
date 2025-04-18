"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileType = selectedFile.type

      // Check if file is PDF or Word document
      if (
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)

        // Create a preview URL for PDF files
        if (fileType === "application/pdf") {
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string)
          }
          reader.readAsDataURL(selectedFile)
        } else {
          // For Word documents, we'll just show a placeholder
          setPreviewUrl(null)
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
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

      // Store file info
      if (file) {
        localStorage.setItem("documentName", file.name)
        localStorage.setItem("documentUploaded", "true")

        toast({
          title: "Document uploaded",
          description: "Your document has been uploaded successfully",
        })
      }
    }, 2000)
  }

  const handleNext = () => {
    router.push("/upload-signature")
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
        {file ? (
          <div className="text-center w-full">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

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
                    setFile(null)
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
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500 mb-2">Drag and drop your file here, or</p>
            <label htmlFor="document-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-primary underline">browse files</span>
              <input
                id="document-upload"
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX</p>
          </>
        )}
      </div>

      {previewUrl && (
        <div className="border rounded-lg overflow-hidden h-96">
          <iframe src={previewUrl} className="w-full h-full" title="Document preview" />
        </div>
      )}

      {!previewUrl && file && (
        <div className="border rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {file.name.endsWith(".pdf") ? "PDF preview is loading..." : "Preview not available for Word documents"}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={uploadProgress !== 100} className="flex items-center">
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
