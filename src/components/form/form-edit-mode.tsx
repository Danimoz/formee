'use client';

import FieldTypes from "./field-types";
import FieldProperties from "./form-properties";
import FormBuilderArea from "./form-builder-area";
import { useFormContext } from "@/context/form-context";

export default function FormEditMode() {
  const {
    addNewField,
    addNewSection,
    selectedSection,
  } = useFormContext();

  return (
    <div className="grid md:grid-cols-12 gap-6">
      {/* Left sidebar - Field types */}
      <FieldTypes
        addNewField={addNewField}
        sectionId={selectedSection?.id || ''}
        addNewSection={addNewSection}
      />

      {/* Main content - Form builder area */}
      <FormBuilderArea />

      {/* Right sidebar - Field properties */}
      <FieldProperties />
    </div>
  )
}