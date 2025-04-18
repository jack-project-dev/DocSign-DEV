"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon } from "lucide-react"

interface SignatureUploadProps {
  onUploadComplete?: () => void
}

export default function SignatureUpload({ onUploadComplete }: SignatureUploadProps) {
  const [signature, setSignature] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

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

  const handleUpload = async () => {
    if (!signature || !previewUrl) return

    setIsUploading(true)

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store signature info in localStorage (in a real app, you'd upload to a server)
      localStorage.setItem("signatureUrl", previewUrl)
      localStorage.setItem("signatureUploaded", "true")

      toast({
        title: "Signature uploaded",
        description: "Your signature has been uploaded successfully. You will now be redirected to sign your document.",
      })

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your signature",
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
          {previewUrl ? (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <img src={previewUrl || "/placeholder.svg"} alt="Signature preview" className="max-h-24 mx-auto" />
              </div>
              <p className="text-sm font-medium">{signature?.name}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSignature(null)
                  setPreviewUrl(null)
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">Drag and drop your signature image here, or</p>
              <label htmlFor="signature-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-gray-900 underline">browse files</span>
                <input
                  id="signature-upload"
                  type="file"
                  className="sr-only"
                  accept=".png,image/png"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">Supported format: PNG only</p>
            </>
          )}
        </div>
      </div>
      <Button className="w-full mt-4" disabled={!signature || isUploading} onClick={handleUpload}>
        {isUploading ? "Uploading..." : "Upload Signature"}
      </Button>
    </div>
  )
}
