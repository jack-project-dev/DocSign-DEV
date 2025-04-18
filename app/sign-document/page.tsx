"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import { Square, Download, Check } from "lucide-react"

export default function SignDocument() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [signatureUrl, setSignatureUrl] = useState("")
  const [signatureBoxes, setSignatureBoxes] = useState<{ x: number; y: number; width: number; height: number }[]>([])
  const [isDrawingBox, setIsDrawingBox] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const [isReadyToSign, setIsReadyToSign] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication and required data
    const authStatus = localStorage.getItem("isAuthenticated")
    const docUploaded = localStorage.getItem("documentUploaded")
    const sigUploaded = localStorage.getItem("signatureUploaded")

    if (authStatus !== "true" || docUploaded !== "true" || sigUploaded !== "true") {
      router.push("/dashboard")
      return
    }

    setIsAuthenticated(true)
    setDocumentName(localStorage.getItem("documentName") || "")
    setSignatureUrl(localStorage.getItem("signatureUrl") || "")
  }, [router])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawingBox || !canvasRef.current || !isReadyToSign) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStartPoint({ x, y })
    setCurrentBox({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingBox || !startPoint || !canvasRef.current || !isReadyToSign) return

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
    if (!isDrawingBox || !currentBox || !isReadyToSign) return

    if (currentBox.width > 20 && currentBox.height > 20) {
      setSignatureBoxes([...signatureBoxes, currentBox])
    }

    setStartPoint(null)
    setCurrentBox(null)
  }

  const toggleDrawMode = () => {
    setIsDrawingBox(!isDrawingBox)
  }

  const handleReadyToSign = () => {
    setIsReadyToSign(true)
    toast({
      title: "Ready to sign",
      description: "You can now place signature boxes on the document",
    })
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
    element.setAttribute("download", `${documentName.split(".")[0]}_signed.pdf`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Document downloaded",
      description: "Your signed document has been downloaded as PDF",
    })
  }

  if (!isAuthenticated) {
    return null // Don't render anything while checking auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sign Document</h1>
          <div className="flex space-x-2">
            {!isReadyToSign ? (
              <Button onClick={handleReadyToSign}>Ready to Sign</Button>
            ) : !isSigned ? (
              <>
                <Button
                  variant={isDrawingBox ? "default" : "outline"}
                  onClick={toggleDrawMode}
                  disabled={!isReadyToSign}
                >
                  <Square className="h-4 w-4 mr-2" />
                  {isDrawingBox ? "Drawing Mode Active" : "Place Signature Box"}
                </Button>
                <Button onClick={handleSign} disabled={signatureBoxes.length === 0 || isSigning}>
                  {isSigning ? "Signing..." : "Get Signed"}
                </Button>
              </>
            ) : (
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Signed PDF
              </Button>
            )}
          </div>
        </div>

        <Card className="p-4 mb-4">
          <p className="text-sm text-gray-500">
            Document: <span className="font-medium text-gray-900">{documentName}</span>
          </p>
          {isReadyToSign && !isSigned && (
            <p className="text-sm text-gray-500 mt-1">
              {isDrawingBox
                ? "Click and drag to place signature boxes on the document"
                : "Click 'Place Signature Box' to start placing your signature"}
            </p>
          )}
          {!isReadyToSign && (
            <p className="text-sm text-gray-500 mt-1">Click "Ready to Sign" to proceed with signing your document</p>
          )}
          {isSigned && (
            <div className="flex items-center mt-1 text-green-600">
              <Check className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Document signed successfully</span>
            </div>
          )}
        </Card>

        <div
          ref={canvasRef}
          className={`bg-white border rounded-lg shadow-sm w-full h-[800px] relative overflow-auto ${
            !isReadyToSign ? "opacity-50 pointer-events-none" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Mock document content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Sample Document</h2>
            <p className="mb-4">
              This is a sample document that requires your signature. Please review the content carefully before
              signing.
            </p>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
              nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt,
              nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
            </p>
            <p className="mb-4">
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque,
              auctor sit amet aliquam vel, ullamcorper sit amet ligula. Curabitur aliquet quam id dui posuere blandit.
              Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
            </p>
            <p className="mb-4">
              Pellentesque in ipsum id orci porta dapibus. Vivamus magna justo, lacinia eget consectetur sed, convallis
              at tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur non nulla sit amet
              nisl tempus convallis quis ac lectus.
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
      </main>
    </div>
  )
}
