/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AIFormField } from "@/interfaces";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

interface FormFieldProps {
  field: AIFormField
  register: any
  errors: any
  control: any
  setValue: any
  isActive: boolean
  onComplete: () => void
}

export default function FormField({
  field,
  register,
  errors,
  control,
  isActive,
  onComplete,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Add a small delay to trigger the animation after the component mounts
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div className={`space-y-2 transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <Label htmlFor={field.id} className="text-base font-medium">
              {field.label}
            </Label>
            <div className="flex gap-2">
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                autoFocus={isActive}
                {...register(field.id, {
                  required: field.required,
                  pattern:
                    field.type === "email"
                      ? {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      }
                      : undefined,
                })}
                className={cn(
                  errors[field.id] && "border-destructive",
                  "flex-grow transition-all duration-200",
                  focused && "border-primary",
                )}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              {isActive && (
                <Button
                  type="button"
                  onClick={onComplete}
                  size="sm"
                  className={cn("transition-opacity duration-200", focused ? "opacity-100" : "opacity-0")}
                >
                  Next
                </Button>
              )}
            </div>
            {errors[field.id] && (
              <p className="text-destructive text-sm mt-1">{errors[field.id].message || "This field is required"}</p>
            )}
          </div>
        )

      case "textarea":
        return (
          <div className={`space-y-2 transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <Label htmlFor={field.id} className="text-base font-medium">
              {field.label}
            </Label>
            <div className="flex flex-col gap-2">
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                autoFocus={isActive}
                {...register(field.id, { required: field.required })}
                className={cn(
                  errors[field.id] && "border-destructive",
                  "min-h-[100px] transition-all duration-200",
                  focused && "border-primary",
                )}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              {isActive && (
                <Button type="button" onClick={onComplete} size="sm" className="self-end">
                  Next
                </Button>
              )}
            </div>
            {errors[field.id] && <p className="text-destructive text-sm mt-1">{errors[field.id]}</p>}
          </div>
        )

      case "select":
        return (
          <div className={`space-y-2 transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <Label htmlFor={field.id} className="text-base font-medium">
              {field.label}
            </Label>
            <Controller
              name={field.id}
              control={control}
              defaultValue=""
              rules={{ required: field.required }}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col gap-2">
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val)
                    }}
                  >
                    <SelectTrigger
                      id={field.id}
                      className={cn(
                        errors[field.id] && "border-destructive",
                        "transition-all duration-200",
                        focused && "border-primary",
                      )}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isActive && (
                    <Button type="button" onClick={onComplete} size="sm" className="self-end">
                      Next
                    </Button>
                  )}
                </div>
              )}
            />
            {errors[field.id] && <p className="text-destructive text-sm mt-1">{errors[field.id]}</p>}
          </div>
        )

      case "radio":
        return (
          <div className={`space-y-2 transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <Label className="text-base font-medium">{field.label}</Label>
            <Controller
              name={field.id}
              control={control}
              defaultValue=""
              rules={{ required: field.required }}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  value={value}
                  onValueChange={(val) => {
                    onChange(val)
                    // Use setTimeout to avoid state updates during render
                    if (val) {
                      setTimeout(() => {
                        onComplete()
                      }, 500)
                    }
                  }}
                  className="space-y-2"
                >
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors[field.id] && <p className="text-destructive text-sm mt-1">{errors[field.id]}</p>}
            {isActive && (
              <Button type="button" onClick={onComplete} size="sm" className="mt-2">
                Next
              </Button>
            )}
          </div>
        )

      case "checkbox":
        return (
          <div className={`space-y-2 transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center space-x-2">
              <Controller
                name={field.id}
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Checkbox id={field.id} checked={value} onCheckedChange={onChange} />
                )}
              />
              <Label htmlFor={field.id} className="text-base font-medium">
                {field.label}
              </Label>
            </div>
            {isActive && (
              <Button type="button" onClick={onComplete} size="sm" className="mt-2">
                Next
              </Button>
            )}
          </div>
        )

      case "date":
        return (
          <div className={`space-y-2 transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <Label className="text-base font-medium">{field.label}</Label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required }}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !value && "text-muted-foreground",
                          errors[field.id] && "border-destructive",
                          focused && "border-primary",
                        )}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(new Date(value), "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            onChange(date)
                            // Use setTimeout to avoid state updates during render
                            setTimeout(() => {
                              document.body.click()
                            }, 0)
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {isActive && (
                    <Button type="button" onClick={onComplete} size="sm" className="self-end">
                      Next
                    </Button>
                  )}
                </div>
              )}
            />
            {errors[field.id] && <p className="text-destructive text-sm mt-1">Please select a date</p>}
          </div>
        )

      default:
        return (
          <div className={`transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <p>Unsupported field type: {field.type}</p>
            {isActive && (
              <Button type="button" onClick={onComplete} size="sm">
                Next
              </Button>
            )}
          </div>
        )
    }
  }

  return renderField()
}