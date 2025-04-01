import { Layers } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DraggableFieldType } from "./draggable-fields";

interface FieldTypesProps {
  addNewField: (type: string, sectionId: string) => void;
  sectionId: string
  addNewSection: () => void
}

export default function FieldTypes({ addNewField, sectionId, addNewSection }: FieldTypesProps) {
  return (
    <Card className="md:col-span-3 h-fit">
      <CardHeader>
        <CardTitle>Add Field</CardTitle>
        <CardDescription>Drag or click to add a new field</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div onClick={() => addNewField("text", sectionId)}>
            <DraggableFieldType type="text" label="Text">
              <span className="w-full h-1 bg-primary/20 rounded" />
            </DraggableFieldType>
          </div>

          <div onClick={() => addNewField("number", sectionId)}>
            <DraggableFieldType type="number" label="Number">
              <span className="w-full h-1 bg-primary/20 rounded" />
            </DraggableFieldType>
          </div>

          <div onClick={() => addNewField("email", sectionId)}>
            <DraggableFieldType type="email" label="Email">
              <span className="w-full h-1 bg-primary/20 rounded" />
            </DraggableFieldType>
          </div>

          <div onClick={() => addNewField("textarea", sectionId)}>
            <DraggableFieldType type="textarea" label="Textarea">
              <span className="w-full h-4 bg-primary/20 rounded" />
            </DraggableFieldType>
          </div>

          <div onClick={() => addNewField("file", sectionId)}>
            <DraggableFieldType type="file" label="File">
                <div className="w-full h-6 border border-primary/30 rounded flex items-center justify-between px-2">
                  <span className="w-10 h-1 bg-primary/20 rounded" />
                  <span className="text-xs">📎</span>
                </div>
            </DraggableFieldType>
          </div>

          <div onClick={() => addNewField("radio", sectionId)}>
            <DraggableFieldType type="radio" label="Radio">
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full border border-primary/50" />
                  <div className="w-10 h-1 bg-primary/20 rounded" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full border border-primary/50" />
                  <div className="w-10 h-1 bg-primary/20 rounded" />
                </div>
              </div>
            </DraggableFieldType>
          </div>

          <div onClick={() => addNewField("select", sectionId)}>
            <DraggableFieldType type="select" label="Dropdown">
              <div className="w-full h-6 border border-primary/30 rounded flex items-center justify-between px-2">
                <div className="w-10 h-1 bg-primary/20 rounded" />
                <div className="text-xs">▼</div>
              </div>
            </DraggableFieldType>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={addNewSection} className="w-full" variant="outline">
          <Layers className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </CardFooter>
    </Card>
  )
}