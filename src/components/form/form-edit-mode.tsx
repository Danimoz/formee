'use client';

import FieldTypes from "./field-types";
import FieldProperties from "./form-properties";
import FormBuilderArea from "./form-builder-area";
import { useFormContext } from "@/context/form-context";
import { useEffect } from "react";

export default function FormEditMode() {
  const {
    addNewField,
    addNewSection,
    selectedSection,
    selectedField,
    updateField,
    formData,
    selectSection
  } = useFormContext();

  // useEffect(() => {
  //   if (!selectedSection && formData.sections.length > 0) {
  //     selectSection(formData.sections[0].id);
  //   }
  // }, [selectedSection, formData.sections]);

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