import { ref, computed, type Ref } from "vue";

// This composable:
// - Defines interfaces for form data, errors, and touched fields
// - Creates reactive states for errors, touched fields, and submission status
// - Implements validation rules for form fields
// - Provides helper functions for:
//   - Field validation
//   - Form submission
//   - State reset
//   - Touch tracking
// - Returns validation state and utility functions

// Define interfaces for form data structure
interface FormData {
  title: string;
  body: string;
  userId: string | number;
}

// Define interface for validation errors
interface FormErrors {
  title?: string;
  body?: string;
  userId?: string;
}

// Define interface for tracking touched form fields
interface TouchedFields {
  title: boolean;
  body: boolean;
  userId: boolean;
}

/**
 * Custom composable for form validation
 * Handles validation rules, error states, and field tracking
 * 
 * @param formData - Reactive form data object
 * @returns Validation state and helper functions
 */
export function useFormValidation(formData: Ref<FormData>) {
  // Initialize reactive states
  const errors = ref<FormErrors>({});
  const touched = ref<TouchedFields>({
    title: false,
    body: false,
    userId: false,
  });
  const isSubmitted = ref(false);

  /**
   * Validates form data against rules
   * Checks title length, body content, and author selection
   */
  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Title validation rules
    if (!formData.value.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.value.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.value.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Body validation rules
    if (!formData.value.body.trim()) {
      newErrors.body = "Content is required";
    } else if (formData.value.body.length < 10) {
      newErrors.body = "Content must be at least 10 characters";
    }

    // Author validation rule
    if (!formData.value.userId) {
      newErrors.userId = "Please select an author";
    }

    errors.value = newErrors;
  };

  /**
   * Computed property to check if form is valid
   */
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  /**
   * Mark specific field as touched
   */
  const touchField = (field: keyof TouchedFields) => {
    touched.value[field] = true;
    validateForm();
  };

  /**
   * Mark all fields as touched
   */
  const touchAll = () => {
    for (const key of Object.keys(touched.value)) {
      touched.value[key as keyof TouchedFields] = true;
    }
    validateForm();
  };

  /**
   * Reset validation state
   */
  const resetValidation = () => {
    errors.value = {};
    touched.value = {
      title: false,
      body: false,
      userId: false,
    };
    isSubmitted.value = false;
  };

  /**
   * Set form as submitted
   */
  const setSubmitted = () => {
    isSubmitted.value = true;
    validateForm();
  };

  return {
    errors,          // Validation errors
    isValid,         // Form validity state
    touchField,      // Mark field as touched
    touchAll,        // Mark all fields as touched
    resetValidation, // Reset validation state
    setSubmitted    // Set form as submitted
  };
}

