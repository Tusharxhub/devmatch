"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { validateForm, type ValidationRules, type ValidationErrors } from "@/lib/form-validation"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  success?: boolean
  className?: string
  multiline?: boolean
  rows?: number
  value: string
  onChange: (value: string) => void
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  error,
  success,
  className,
  multiline = false,
  rows = 3,
  value,
  onChange,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)

  const inputClassName = cn(
    "bg-gray-900 border-gray-700 transition-all duration-200",
    "focus:border-primary-teal focus:ring-primary-teal focus:ring-1",
    error && touched && "border-red-500 focus:border-red-500 focus:ring-red-500",
    success && touched && "border-green-500 focus:border-green-500 focus:ring-green-500",
    focused && "ring-2",
    className,
  )

  const InputComponent = multiline ? Textarea : Input

  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className={cn(
          "transition-colors duration-200",
          error && touched && "text-red-400",
          success && touched && "text-green-400",
          focused && "text-primary-teal",
        )}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <div className="relative">
        <InputComponent
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            setTouched(true)
          }}
          className={inputClassName}
          rows={multiline ? rows : undefined}
        />
        {touched && (error || success) && (
          <div className="absolute right-3 top-3">
            {error ? (
              <AlertCircle className="h-4 w-4 text-red-400" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-400" />
            )}
          </div>
        )}
      </div>
      {error && touched && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {success && touched && !error && (
        <p className="text-sm text-green-400 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Looks good!
        </p>
      )}
    </div>
  )
}

interface EnhancedFormProps {
  children: React.ReactNode
  onSubmit: (data: Record<string, any>) => Promise<void> | void
  validationRules?: ValidationRules
  className?: string
}

export function EnhancedForm({ children, onSubmit, validationRules = {}, className }: EnhancedFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // Validate form
    const validationErrors = validateForm(data, validationRules)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props.name) {
          return React.cloneElement(child, {
            error: errors[child.props.name],
            success: !errors[child.props.name] && child.props.value,
          })
        }
        return child
      })}
    </form>
  )
}
