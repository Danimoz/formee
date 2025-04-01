'use client';

import { useFormContext } from "@/context/form-context"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

export default function FormPreview() {
  const { formData, setActiveTab } = useFormContext()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  const isLastSection = currentSectionIndex === formData.sections.length - 1
  const isFirstSection = currentSectionIndex === 0
  const hasOnlyOneSection = formData.sections.length === 1

  const handleNextSection = () => {
    if (currentSectionIndex < formData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
  }

  const handleSubmit = () => {
    alert("Form submitted!")
    // In a real application, you would handle form submission here
  }

  const currentSection = formData.sections[currentSectionIndex]

  return (
  <>
    {!hasOnlyOneSection && (
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((currentSectionIndex + 1) / formData.sections.length) * 100}%` }}
          ></div>
        </div>
        <span className="ml-4 text-sm text-muted-foreground">
          {currentSectionIndex + 1} of {formData.sections.length}
        </span>
      </div>
    )}

    {/* Form title card - only shown on first section */}
    {isFirstSection && (
      <Card className="mb-4 border-t-4 border-t-primary shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{formData.title}</CardTitle>
          <CardDescription className="text-base">{formData.description}</CardDescription>
        </CardHeader>
      </Card>
    )}

    {/* Current section card */}
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{currentSection.title}</CardTitle>
        <CardDescription>{currentSection.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentSection.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={`preview-${field.id}`} className="text-base font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {field.type === "text" || field.type === "email" || field.type === 'number' ? (
              <Input
                id={`preview-${field.id}`}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="mt-1"
              />
            ) : field.type === "textarea" ? (
              <Textarea
                id={`preview-${field.id}`}
                placeholder={field.placeholder}
                required={field.required}
                className="mt-1"
              />
            ) : field.type === "select" ? (
              <Select>
                <SelectTrigger id={`preview-${field.id}`} className="mt-1">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option, i) => (
                    <SelectItem key={i} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "radio" && field.options ? (
              <RadioGroup className="mt-2 space-y-2">
                {field.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted">
                    <RadioGroupItem value={option} id={`preview-option-${field.id}-${i}`} />
                    <Label htmlFor={`preview-option-${field.id}-${i}`} className="cursor-pointer w-full">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : field.type === "checkbox" && field.options ? (
              <div className="mt-2 space-y-2">
                {field.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted">
                    <Checkbox id={`preview-checkbox-${field.id}-${i}`} />
                    <Label htmlFor={`preview-checkbox-${field.id}-${i}`} className="cursor-pointer w-full">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {currentSection.fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No fields in this section</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-6 border-t">
        <div>
          {!isFirstSection && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
        </div>
        <div>
          {isLastSection || hasOnlyOneSection ? (
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
              Submit
            </Button>
          ) : (
            <Button onClick={handleNextSection} className="bg-primary hover:bg-primary/90">
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>

    <div className="flex justify-center mt-6">
      <Button variant="outline" onClick={() => setActiveTab("edit")}>
        <Edit className="h-4 w-4 mr-2" />
        Back to Editor
      </Button>
    </div>
  </>
  )
}