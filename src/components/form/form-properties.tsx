import { HelpCircle, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { useFormContext } from "@/context/form-context"
import { Textarea } from "../ui/textarea"


export default function FieldProperties() {
  const {
    selectedSection,
    selectedField,
    updateField,
    addNewField,
    updateSection
  } = useFormContext()
  return (
    <Card className="md:col-span-3 h-fit">
      <CardHeader>
        <CardTitle>
          {selectedField ? "Field Properties" : selectedSection ? "Section Properties" : "Properties"}        
        </CardTitle>
        <CardDescription>
          {selectedField
            ? "Configure the selected field"
            : selectedSection
              ? "Configure the selected section"
              : "Select a section or field to edit"}        
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedField && selectedSection ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) =>  updateField(selectedSection.id, selectedField.id, { label: e.target.value }) }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={selectedField.type}
                onValueChange={(value) =>
                  updateField(selectedSection.id, selectedField.id, { type: value })
                }
              >
                <SelectTrigger id="field-type">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedField.type === "text" ||
              selectedField.type === "number" ||
              selectedField.type === "email" ||
              selectedField.type === "textarea") && (
                <div className="space-y-2">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={selectedField.placeholder || ""}
                    onChange={(e) =>
                      updateField(selectedSection.id, selectedField.id, {
                        placeholder: e.target.value,
                      })
                    }
                  />
                </div>
              )}

            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={selectedField.required || false}
                onCheckedChange={(checked) =>
                  updateField(selectedSection.id, selectedField.id, { required: checked })
                }
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>

            {(selectedField.type === "radio" ||
              selectedField.type === "checkbox" ||
              selectedField.type === "select") && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedField.options || [])]
                            newOptions[index] = e.target.value
                            updateField(selectedSection.id, selectedField.id, { options: newOptions })
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newOptions = [...(selectedField.options || [])].filter(
                              (_, i) => i !== index,
                            )
                            updateField(selectedSection.id, selectedField.id, { options: newOptions })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [
                          ...(selectedField.options || []),
                          `Option ${(selectedField.options?.length || 0) + 1}`,
                        ]
                        updateField(selectedSection.id, selectedField.id, { options: newOptions })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
          </>
        ) : selectedSection ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                value={selectedSection.title}
                onChange={(e) => updateSection(selectedSection.id, { title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-description">Description</Label>
              <Textarea
                id="section-description"
                value={selectedSection.description}
                onChange={(e) => updateSection(selectedSection.id, { description: e.target.value })}
              />
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addNewField("text", selectedSection.id)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field to Section
              </Button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <HelpCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>Select a section or field to edit its properties</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}