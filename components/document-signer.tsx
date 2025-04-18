"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Square, Check, Download, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DocumentSigner() {
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null)
  const [signatureBoxes, setSignatureBoxes] = useState<{ x: number; y: number; width: number; height: number }[]>([])
  const [isDrawingBox, setIsDrawingBox] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if document and signature are uploaded
    const docName = localStorage.getItem("documentName")
    const docUploaded = localStorage.getItem("documentUploaded")
    const sigUrl = localStorage.getItem("signatureUrl")
    const sigUploaded = localStorage.getItem("signatureUploaded")

    if (!docUploaded || !docName) {
      toast({
        title: "No document found",
        description: "Please upload a document first",
        variant: "destructive",
      })
      router.push("/upload-document")
      return
    }

    if (!sigUploaded || !sigUrl) {
      toast({
        title: "No signature found",
        description: "Please upload your signature first",
        variant: "destructive",
      })
      router.push("/upload-signature")
      return
    }

    setDocumentName(docName)
    setSignatureUrl(sigUrl)
  }, [router, toast])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawingBox || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStartPoint({ x, y })
    setCurrentBox({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingBox || !startPoint || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentBox({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    })
  }

  const handleMouseUp = () => {
    if (!isDrawingBox || !currentBox) return

    if (currentBox.width > 20 && currentBox.height > 20) {
      setSignatureBoxes([...signatureBoxes, currentBox])
    }

    setStartPoint(null)
    setCurrentBox(null)
  }

  const toggleDrawMode = () => {
    setIsDrawingBox(!isDrawingBox)
  }

  const handleSign = async () => {
    if (signatureBoxes.length === 0) {
      toast({
        title: "No signature boxes",
        description: "Please place at least one signature box on the document",
        variant: "destructive",
      })
      return
    }

    setIsSigning(true)

    try {
      // Simulate signing process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSigned(true)
      toast({
        title: "Document signed",
        description: "Your document has been signed successfully",
      })
    } catch (error) {
      toast({
        title: "Signing failed",
        description: "There was an error signing your document",
        variant: "destructive",
      })
    } finally {
      setIsSigning(false)
    }
  }

  const handleDownload = () => {
    // Create a fake PDF download
    const element = document.createElement("a")
    element.setAttribute("href", "data:application/pdf;charset=utf-8,")
    element.setAttribute("download", `${documentName?.split(".")[0]}_signed.pdf`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Document downloaded",
      description: "Your signed document has been downloaded as PDF",
    })
  }

  const handleSignAnother = () => {
    // Clear document and signature data
    localStorage.removeItem("documentName")
    localStorage.removeItem("documentUploaded")
    localStorage.removeItem("signatureUrl")
    localStorage.removeItem("signatureUploaded")

    router.push("/upload-document")
  }

  if (!documentName || !signatureUrl) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-sm text-gray-600">
            Document: <span className="font-medium text-gray-900">{documentName}</span>
          </p>
          {isSigned && (
            <div className="flex items-center mt-1 text-green-600">
              <Check className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Document signed successfully</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isSigned ? (
            <>
              <Button
                variant={isDrawingBox ? "default" : "outline"}
                onClick={toggleDrawMode}
                className="flex items-center"
              >
                <Square className="h-4 w-4 mr-2" />
                {isDrawingBox ? "Drawing Mode Active" : "Place Signature Box"}
              </Button>
              <Button
                onClick={handleSign}
                disabled={signatureBoxes.length === 0 || isSigning}
                className="flex items-center"
              >
                {isSigning ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Signing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Sign Document Safely
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleDownload} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download Signed PDF
              </Button>
              <Button variant="outline" onClick={handleSignAnother} className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Sign Another Document
              </Button>
            </>
          )}
        </div>
      </div>

      {isDrawingBox && !isSigned && (
        <Alert>
          <AlertDescription>
            Click and drag to place signature boxes on the document. You can place multiple signature boxes.
          </AlertDescription>
        </Alert>
      )}

      <div
        ref={canvasRef}
        className="bg-white border rounded-lg shadow-sm w-full h-[800px] relative overflow-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDrawingBox && !isSigned ? "crosshair" : "default" }}
      >
        {/* Mock document content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Sample Document</h2>
          <p className="mb-4">
            This is a sample document that requires your signature. Please review the content carefully before signing.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl
            nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl
            nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
          </p>
          <p className="mb-4">
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque,
            auctor sit amet aliquam vel, ullamcorper sit amet ligula. Curabitur aliquet quam id dui posuere blandit.
            Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
          </p>
          <p className="mb-4">
            Pellentesque in ipsum id orci porta dapibus. Vivamus magna justo, lacinia eget consectetur sed, convallis at
            tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur non nulla sit amet nisl
            tempus convallis quis ac lectus.
          </p>
          <p className="mb-4">
            Nulla quis lorem ut libero malesuada feugiat. Curabitur non nulla sit amet nisl tempus convallis quis ac
            lectus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla porttitor accumsan tincidunt.
          </p>
          <p className="mb-4">Signature Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Signature boxes */}
        {signatureBoxes.map((box, index) => (
          <div
            key={index}
            className={`absolute border-2 ${isSigned ? "border-green-500" : "border-blue-500"} rounded-md`}
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
            }}
          >
            {isSigned && (
              <img
                src={signatureUrl || "/placeholder.svg"}
                alt="Signature"
                className="w-full h-full object-contain p-1"
              />
            )}
          </div>
        ))}

        {/* Current drawing box */}
        {currentBox && (
          <div
            className="absolute border-2 border-blue-500 border-dashed rounded-md bg-blue-50 bg-opacity-30"
            style={{
              left: `${currentBox.x}px`,
              top: `${currentBox.y}px`,
              width: `${currentBox.width}px`,
              height: `${currentBox.height}px`,
            }}
          />
        )}
      </div>
    </div>
  )
}
