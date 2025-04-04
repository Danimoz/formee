/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AIFormSchema } from "@/interfaces"
import { ChevronRight, Loader2, Send } from "lucide-react"
import { useRef, useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "../ui/card"
import { buildZodSchema } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormField from "./form-fields"
import { Button } from "../ui/button";
import { submitForm } from "@/app/actions/generate-form";
import { toast } from "sonner";

interface ConversationalFormProps {
  formId: string
  formFields: string
}

export default function ConversationalForm({ formId, formFields}: ConversationalFormProps) {
  const [activeFieldIndex, setActiveFieldIndex] = useState(0)
  const formEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const parsedFormFields = JSON.parse(formFields) as AIFormSchema
  const allFields = parsedFormFields?.sections.flatMap((section) => section.fields)

  const zodSchema = useMemo(() => buildZodSchema(allFields), [allFields])
  const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(zodSchema),
  })

  const currentField = allFields[activeFieldIndex]
  const currentSection = parsedFormFields?.sections.find((section) =>
    section.fields.some((field) => field.id === currentField.id)
  )

  const isLastField = activeFieldIndex === allFields.length - 1
  const isFirstField = activeFieldIndex === 0

  async function onSubmit(data: any) {
    setIsSubmitting(true)

    const response = await submitForm(formId, data)
    if (response.error) {
      toast.error("Error submitting form")
    }
    toast.success("Form submitted successfully")
    setIsSubmitted(true)
    reset()
  }

  // Simulate typing effect for new questions
  useEffect(() => {
    setIsTyping(true)
    const timer = setTimeout(() => {
      setIsTyping(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [activeFieldIndex])

  // Scroll to the bottom when a new field appears
  useEffect(() => {
    if (formEndRef.current) {
      formEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeFieldIndex, isTyping])

  const handlePrevious = () => {
    if (activeFieldIndex > 0) {
      setActiveFieldIndex((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    // Get the current field
    const currentField = allFields[activeFieldIndex]

    // Trigger validation for the current field
    const fieldState = trigger(currentField.id)

    // Only proceed if the field is valid
    fieldState.then((isValid) => {
      if (isValid) {
        if (activeFieldIndex < allFields.length - 1) {
          setActiveFieldIndex((prev) => prev + 1)
        } else {
          setIsSubmitting(true)
          handleSubmit((data) => {
            onSubmit(data)
            setIsSubmitting(false)
          })()
        }
      }
    })
  }

  // Get visible fields up to the current active field
  const getVisibleFields = () => {
    return allFields.slice(0, activeFieldIndex + 1)
  }

  return (
    <div className="space-y-4 md:container mx-4 md:mx-auto p-6">
      {isSubmitted ? (
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold">Form Submitted Successfully!</h2>
            <p className="text-muted-foreground">Thank you for your submission.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">{parsedFormFields.title}</h1>
            <p className="text-gray-600">{parsedFormFields.description}</p>
          </div>
          {/* Render the form fields here */}
          <div className="space-y-3">
            {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-1.5 mb-6">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((activeFieldIndex + 1) / allFields.length) * 100}%` }}
              />
            </div>

            {/* Current section header */}
            {currentSection && (
              <div className="mb-4 transition-opacity duration-300 ease-in-out">
                <h2 className="text-xl font-semibold text-primary">{currentSection.title}</h2>
                <p className="text-muted-foreground text-sm">{currentSection.description}</p>
              </div>
            )}

            {/* Conversation bubbles */}
            <div className="space-y-6">
              {getVisibleFields().map((field, index) => (
                <div
                  key={field.id}
                  className={`transition-all duration-300 ease-in-out ${index === activeFieldIndex ? "opacity-100" : "opacity-70"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </div>

                    <Card className={`p-4 flex-grow shadow-sm ${index === activeFieldIndex ? "border-primary/30" : ""}`}>
                      <FormField
                        field={field}
                        register={register}
                        errors={errors}
                        control={control}
                        setValue={setValue}
                        isActive={index === activeFieldIndex}
                        onComplete={handleNext}
                      />
                    </Card>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>

                  <Card className="p-4 flex-grow shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstField || isTyping}
                className="transition-opacity duration-200"
                size="sm"
              >
                Previous
              </Button>

              {isLastField && !isTyping ? (
                <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !isValid} className="px-6">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isTyping || !!errors[currentField?.id]} size="sm">
                  Next
                </Button>
              )}
            </div>

            <div ref={formEndRef} />
          </div>
        </>
      )}
    </div>
  )
}