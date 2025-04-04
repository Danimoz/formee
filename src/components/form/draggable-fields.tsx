/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { GripVertical, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { AIFormField } from "@/interfaces";

interface DraggableFieldTypeProps {
  type: string
  label: string
  children: React.ReactNode
}

interface DraggableFormFieldProps {
  field: AIFormField
  index: number
  isSelected: boolean
  sectionId: string
  onSelect: (fieldId: string, sectionId: string) => void
  onDelete: (index: number) => void
  onMove: (dragIndex: number, hoverIndex: number, sectionIdx: string) => void
}

function DraggableFieldType({ type, label, children }: DraggableFieldTypeProps) {
  const dragRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD_TYPE',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  drag(dragRef)

  return (
    <div ref={dragRef} className={`${isDragging ? 'opacity-50' : ''}`}>
      <Button
        variant="outline"
        className="h-20 flex flex-col gap-1 justify-center cursor-grab active:cursor-grabbing w-full"
      >
        <span className="text-xs font-normal text-muted-foreground">{label}</span>
        {children}
      </Button>
    </div>
  )
}

function renderField(field: AIFormField) {
  switch (field?.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'file':
      <Input disabled placeholder={field?.placeholder || `Enter ${field?.label}`} type={field.type} className="w-full" />
    case 'textarea':
      <Textarea disabled placeholder={field.placeholder} className="w-full" />
    case 'select':
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>
      </Select>
    case 'radio':
    case 'checkbox':
      <>
        {field.options && (
          <RadioGroup disabled value={field.placeholder}>
            {field.options.map((option: any, index: number) => (
              <div key={option} className="flex items-center gap-2">
                <RadioGroupItem id={`option-${field.id}-${index}`} value={option} disabled />
                <Label htmlFor={`option-${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </>
    default:
      return null
  }
}

function DraggableFormField({ field, index, isSelected, sectionId, onSelect, onDelete, onMove }: DraggableFormFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_FIELD',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop(() => ({
    accept: 'FORM_FIELD',
    hover(item: { index: number }, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return
      onMove(dragIndex, hoverIndex, sectionId)
      item.index = hoverIndex 
    },
  }))

  drag(drop(ref))

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`border rounded-lg p-4 mb-2 transition-all ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(field.id, sectionId)
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded-sm touch-none">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-semibold">{field.label}</span>
          {field.required && (
            <Badge variant="outline" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              const currentIndex = index
              if (currentIndex > 0) {
                onMove(currentIndex, currentIndex - 1, sectionId)
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
              const currentIndex = index
              // We don't know the total length here, but the onMove function will handle validation
              onMove(currentIndex, currentIndex + 1, sectionId)
            }}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(index)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {renderField(field)}
    </motion.div>
  )
}

export {
  DraggableFieldType,
  DraggableFormField,
}