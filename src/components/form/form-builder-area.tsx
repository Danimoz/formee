'use client'

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { AnimatePresence } from "framer-motion"
import DraggableSection from "./draggable-section"
import { useFormContext } from "@/context/form-context"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export default function FormBuilderArea() {
  const {
    formData,
    handleInputChange,
    selectedSection,
    selectedField,
    selectSection,
    deleteSection,
    addNewSection,
    updateSection,
    moveSection,
    deleteField,
    moveField,
    addNewField,
    handleSelectField
  } = useFormContext()

  return (
    <Card className="md:col-span-6">
      <CardHeader>
        <div className="space-y-1">
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="text-2xl font-semibold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Form Title"
          />
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="resize-none border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Form Description"
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        <AnimatePresence>
          {formData.sections.map((section, sectionIndex) => (
            <DraggableSection
              key={section.id}
              section={section}
              sectionIndex={sectionIndex}
              isSelected={selectedSection?.id === section.id}
              onSelectSection={selectSection}
              onDeleteSection={deleteSection}
              moveSection={moveSection}
              onAddField={addNewField}
              onFieldSelect={handleSelectField}
              selectedFieldId={selectedField?.id}
              moveField={moveField}
              deleteField={deleteField}
              onSectionUpdate={updateSection}
            />
          ))}
        </AnimatePresence>
      </CardContent>
      <CardFooter>
        <Button onClick={addNewSection} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </CardFooter>
    </Card>
  )
}