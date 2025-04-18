"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText } from "lucide-react"

interface DocumentUploadProps {
  onUploadComplete?: () => void
}

export default function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
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
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store file info in localStorage (in a real app, you'd upload to a server)
      localStorage.setItem("documentName", file.name)
      localStorage.setItem("documentUploaded", "true")

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully. Please upload your signature next.",
      })

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          {file ? (
            <div className="text-center">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
                Remove
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">Drag and drop your file here, or</p>
              <label htmlFor="document-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-gray-900 underline">browse files</span>
                <input
                  id="document-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX</p>
            </>
          )}
        </div>
      </div>
      <Button className="w-full mt-4" disabled={!file || isUploading} onClick={handleUpload}>
        {isUploading ? "Uploading..." : "Upload Document"}
      </Button>
    </div>
  )
}
