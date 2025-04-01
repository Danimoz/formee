'use client'

import { Edit, Eye, MessageSquareText, Save, Send } from "lucide-react"
import { Button } from "../ui/button"
import { AnimatePresence, motion } from "framer-motion"
import FormEditMode from "./form-edit-mode"
import { AIFormSchema, Conversation } from "@/interfaces"
import { useFormContext } from "@/context/form-context"
import { useEffect, useState } from "react"
import FormPreview from "./form-preview"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { generateForm, saveForm } from "@/app/actions/generate-form"
import { getBaseUrl } from "@/lib/utils"
import FormBuilderSkeleton from "./form-builder-skeleton"

interface FormBuilderProps {
  conversation: string
  conversationId: string
  formId?: string
}

export default function FormBuilder({ conversation, conversationId, formId }: FormBuilderProps) {
  const {
    activeTab,
    setActiveTab,
    setFormData,
    formData,
    setSelectedSection
  } = useFormContext()
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [refinePrompt, setRefinePrompt] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (conversation) {
      const currentForm = JSON.parse(conversation) as AIFormSchema
      setFormData(currentForm)
      setSelectedSection(currentForm?.sections[0] || [
        {
          id: `section_${Date.now()}`,
          title: "New Section",
          description: 'Section description',
          fields: []
        }
      ])
    }
  }, [conversation])

  async function refineForm() {
    if (!refinePrompt.trim() || isLoading) return
    try {
      setIsRefining(true)
      const response = await generateForm(refinePrompt, conversationId)
      if (response?.error) {
        toast.error(response.error)
        return
      }
      setFormData(response?.data)
      toast.success("Form refined successfully")
      setRefinePrompt('')
    } catch(error) {
      console.error(error)
      toast.error("Failed to refine form")
    } finally {
      setIsRefining(false)
    }
  }

  async function handleSave(){
    try {
      setIsLoading(true)
      const response = await saveForm(formData, conversationId)
      if (response?.error) {
        toast.error(response.error)
        return
      }
      setShareLink(`${getBaseUrl()}/f/${response.formId}`)
      setShowShareDialog(true)
      toast.success("Form saved successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save form")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="md:container mx-4 md:mx-auto p-3">
      <div className="flex justify-between items-center mb-4">
        <div className="border-b mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("edit")}
              className={`pb-2 px-1 font-medium text-sm flex items-center gap-2 ${activeTab === "edit"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`pb-2 px-1 font-medium text-sm flex items-center gap-2 ${activeTab === "preview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <Button size="sm" className="gap-2" onClick={() => handleSave()} disabled={isLoading}>
              <Save className="h-4 w-4" />
              Save Form
            </Button>
          </div>
        </div>

        <div className="relative flex items-center">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: isInputVisible ? -320 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsInputVisible(!isInputVisible)}>
              <MessageSquareText className="h-4 w-4" />
              AI Assistant
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: isInputVisible ? 1 : 0, width: isInputVisible ? 300 : 0  }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-0"
          >
            {isInputVisible && (
              <div className="flex w-full items-center gap-2">
                <Input 
                  placeholder="Improve and refine the form" 
                  className="w-[320px]"
                  disabled={isRefining}
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      refineForm()
                    }
                  }}
                />
                <Button size="icon" onClick={() => refineForm()} disabled={isRefining}>
                  <Send />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {isRefining && <FormBuilderSkeleton />}
      
      <AnimatePresence mode="wait">
        {activeTab === "edit" && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:container mx-4 md:mx-auto"
          >
            <FormEditMode />
          </motion.div>
        )}
        {activeTab === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="max-w-3xl mx-auto"
          >
            <FormPreview />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your form is ready to share!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Share this link with others to collect responses:</p>
            <div className="flex items-center gap-2">
              <Input value={shareLink} readOnly />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast('Link copied to clipboard', { description: 'You can now share it with others.' });
                }}
              >
                Copy
              </Button>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowShareDialog(false);
                router.push('/dashboard');
              }}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
