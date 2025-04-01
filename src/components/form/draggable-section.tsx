'use client';

import { FormSection } from "@/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, GripVertical, MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DraggableFormField } from "./draggable-fields";

interface DraggableSectionProps {
  sectionIndex: number
  section: FormSection
  isSelected: boolean
  onSelectSection: (sectionId: string) => void
  onDeleteSection: (sectionId: string) => void
  moveSection: (dragIndex: number, hoverIndex: number) => void
  onAddField: (sectionId: string, fieldType: string) => void
  onFieldSelect: (fieldId: string, sectionId: string) => void
  selectedFieldId: string | null | undefined
  moveField: (sectionId: string, dragIndex: number, hoverIndex: number) => void
  deleteField: (sectionId: string, fieldId: string) => void
  onSectionUpdate: (sectionId: string, updates: Partial<FormSection>) => void
}

export default function DraggableSection({
  section,
  sectionIndex,
  isSelected,
  onSelectSection,
  onDeleteSection,
  moveSection,
  onAddField,
  onFieldSelect,
  selectedFieldId,
  moveField,
  deleteField,
  onSectionUpdate,
}: DraggableSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const [{ isDragging }, drag] = useDrag({
    type: "SECTION",
    item: { sectionIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "SECTION",
    hover(item: { sectionIndex: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.sectionIndex
      const hoverIndex = sectionIndex

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveSection(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.sectionIndex = hoverIndex
    },
  })

  // Field drop target
  const [{ isOver }, fieldDrop] = useDrop(() => ({
    accept: "FIELD_TYPE",
    drop: (item: { type: string }) => {
      onAddField(section.id, item.type)
      return { dropped: true }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  drag(drop(ref))
  fieldDrop(fieldRef)

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`border rounded-lg transition-all ${isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
        } ${isDragging ? "opacity-50" : "opacity-100"}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelectSection(section.id)
      }}
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded-sm touch-none">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <Input
                value={section.title}
                onChange={(e) => onSectionUpdate(section.id, { title: e.target.value })}
                className="text-lg font-semibold border-none px-0 py-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Section Title"
                onClick={(e) => e.stopPropagation()}
              />
              <Textarea
                value={section.description}
                onChange={(e) => onSectionUpdate(section.id, { description: e.target.value })}
                className="resize-none border-none px-0 py-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-muted-foreground"
                placeholder="Section Description"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = sectionIndex
                if (currentIndex > 0) {
                  moveSection(currentIndex, currentIndex - 1)
                }
              }}
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = sectionIndex
                moveSection(currentIndex, currentIndex + 1)
              }}
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteSection(section.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div ref={fieldRef} className={`p-4 space-y-4 ${isOver ? "bg-primary/5" : ""}`}>
          {section.fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-2 text-sm">Drag a field here or click to add</p>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddField(section.id, "text")
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {section.fields.map((field, fieldIndex) => (
                <DraggableFormField
                  key={field.id}
                  field={field}
                  sectionId={section.id}
                  index={fieldIndex}
                  isSelected={selectedFieldId === field.id}
                  onSelect={onFieldSelect}
                  onDelete={() => deleteField(field.id, section.id)}
                  onMove={(dragIndex, hoverIndex) => moveField(section.id, dragIndex, hoverIndex)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
    </motion.div>
  )
}
