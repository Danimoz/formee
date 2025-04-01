import { useRef } from "react"
import { useDrop } from "react-dnd"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

interface FormDropAreaProps {
  children: React.ReactNode
  onDrop: (fieldType: string, sectionIdx: number) => void
  isEmpty?: boolean
  sectionIdx: number
}

export function FormDropArea({ children, onDrop, isEmpty, sectionIdx }: FormDropAreaProps) {
  const dropRef = useRef<HTMLDivElement>(null)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FIELD_TYPE",
    drop: (item: { type: string }) => {
      onDrop(item.type, sectionIdx)
      return { dropped: true}
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [])

  drop(dropRef)

  return (
    <div
      ref={dropRef}
      className={`border rounded-lg ${isEmpty ? 'flex flex-col items-center justify-center py-12 border-2' : ''} ${isOver ? 'bg-primary/5 border-primary' : 'border-gray-300'}`}
    >
      {isEmpty ? (
        <>
          <p className="text-muted-foreground mb-4">{isOver ? "Drop to add field" : "Drag a field here or click to add"}</p>
          <Button onClick={() => onDrop('text', sectionIdx)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </>
        ) 
        : children
      }
      
    </div>
  )
}