export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export function validateForm(data: Record<string, any>, rules: ValidationRules): ValidationErrors {
  const errors: ValidationErrors = {}

  Object.keys(rules).forEach((field) => {
    const value = data[field]
    const rule = rules[field]

    // Required validation
    if (rule.required && (!value || (typeof value === "string" && value.trim() === ""))) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      return
    }

    // Skip other validations if field is empty and not required
    if (!value) return

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`
      return
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] =
        `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`
      return
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`
      return
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        errors[field] = customError
        return
      }
    }
  })

  return errors
}

export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
      return null
    },
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  bio: {
    maxLength: 500,
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      try {
        new URL(value)
        return null
      } catch {
        return "Please enter a valid URL"
      }
    },
  },
}
