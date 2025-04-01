'use client';

import { AIFormField, AIFormSchema, FormSection } from '@/interfaces';
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

interface FormContextType {
  formData: AIFormSchema;
  setFormData: React.Dispatch<React.SetStateAction<AIFormSchema>>;
  selectedField: AIFormField | null;
  selectedSection: FormSection | null;
  setSelectedSection: React.Dispatch<React.SetStateAction<FormSection | null>>;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
  handleInputChange: (key: string, value: string) => void;
  addNewSection: () => void;
  deleteSection: (sectionId: string) => void;
  selectSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  addNewField: (type: string, sectionId: string) => void;
  deleteField: (fieldId: string, sectionId: string) => void;
  updateField: (sectionId: string, fieldId: string, updates: Partial<AIFormField>) => void;
  handleSelectField: (fieldId: string, sectionId: string) => void;
  moveField: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children, initialData }: { children: ReactNode, initialData: AIFormSchema }) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [selectedField, setSelectedField] = useState<AIFormField | null>(null);
  const [selectedSection, setSelectedSection] = useState<FormSection | null>(null);
  const [formData, setFormData] = useState<AIFormSchema>(initialData);

  useEffect(() => {
    setSelectedSection(null)
    setSelectedField(null)
  }, [activeTab])

  const handleInputChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addNewSection = useCallback(() => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: "New Section",
      description: 'Section description',
      fields: []
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSection(newSection);
    setSelectedField(null);
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
    if (selectedSection?.id === sectionId) setSelectedSection(null);
  }, [selectedSection?.id]);

  const selectSection = useCallback((sectionId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (section) {
      setSelectedSection(section);
      setSelectedField(null);
    }
  }, [formData.sections]);

  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
    if (selectedSection?.id === sectionId) {
      setSelectedSection((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updates };
      });
    }
  }

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    if (
      dragIndex < 0 ||
      hoverIndex < 0 ||
      dragIndex >= formData.sections.length ||
      hoverIndex >= formData.sections.length
    ) {
      return;
    }

    setFormData(prev => {
      const newSections = [...prev.sections];
      const draggedSection = newSections[dragIndex];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      return { ...prev, sections: newSections };
    });
  }, [formData.sections.length]);

  const addNewField = useCallback((type: string, sectionId: string) => {
    if (formData.sections.length === 0) {
      const newSection: FormSection = {
        id: `section_${Date.now()}`,
        title: "New Section",
        description: 'Section description',
        fields: []
      };
      const newField: AIFormField = {
        id: Date.now().toString(),
        type,
        label: `New ${type} field`,
        required: false,
        placeholder: `Enter ${type}...`
      };
      if (type === 'radio' || type === 'checkbox' || type === 'select') {
        newField.options = ["Option 1", "Option 2", "Option 3"];
      }
      newSection.fields.push(newField);
      setFormData(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
      setSelectedSection(newSection);
      setSelectedField(newField);
    } else {
      const newField: AIFormField = {
        id: Date.now().toString(),
        type,
        label: `New ${type} field`,
        required: false,
        placeholder: `Enter ${type}...`
      };
      if (type === 'radio' || type === 'checkbox' || type === 'select') {
        newField.options = ["Option 1", "Option 2", "Option 3"];
      }
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? { ...section, fields: [...section.fields, newField] }
            : section
        )
      }));
      setSelectedField(newField);
    }
  }, [formData.sections]);

  const deleteField = useCallback((fieldId: string, sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter(f => f.id !== fieldId) }
          : section
      ),
    }));
    if (selectedField?.id === fieldId) setSelectedField(null);
  }, [selectedField?.id]);

  const updateField = (sectionId: string, fieldId: string, updates: Partial<AIFormField>) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
            ...section,
            fields: section.fields.map(field =>
              field.id === fieldId ? { ...field, ...updates } : field
            ),
          }
          : section
      ),
    }));
    if (selectedField?.id === fieldId) {
      setSelectedField((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updates };
      });
    }
  };

  const handleSelectField = useCallback((fieldId: string, sectionId: string) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;

    const field = section.fields.find(f => f.id === fieldId);
    if (field) {
      setSelectedSection(section);
      setSelectedField(field);
    }
  }, [formData.sections, setSelectedField, setSelectedSection]);

  const moveField = useCallback((sectionId: string, dragIndex: number, hoverIndex: number) => {
    const section = formData.sections.find((s) => s.id === sectionId);
    if (!section) return;

    if (dragIndex < 0 || hoverIndex < 0 || dragIndex >= section.fields.length || hoverIndex >= section.fields.length) {
      return;
    }

    setFormData(prev => {
      const newSections = prev.sections.map(s => {
        if (s.id !== sectionId) return s;
        const newFields = [...s.fields];
        const draggedField = newFields[dragIndex];
        newFields.splice(dragIndex, 1);
        newFields.splice(hoverIndex, 0, draggedField);
        return { ...s, fields: newFields };
      });
      return { ...prev, sections: newSections };
    });
  }, [formData.sections]);

  const value = {
    formData,
    selectedField,
    selectedSection,
    activeTab,
    setActiveTab,
    handleInputChange,
    addNewSection,
    deleteSection,
    selectSection,
    updateSection,
    moveSection,
    addNewField,
    deleteField,
    updateField,
    handleSelectField,
    moveField,
    setFormData,
    setSelectedSection,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}