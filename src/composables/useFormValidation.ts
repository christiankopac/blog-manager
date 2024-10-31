import { ref, computed, watch, type Ref } from "vue";

interface FormData {
  title: string;
  body: string;
  userId: string | number;
}

interface FormErrors {
  title?: string;
  body?: string;
  userId?: string;
}

interface TouchedFields {
  title: boolean;
  body: boolean;
  userId: boolean;
}

export function useFormValidation(formData: Ref<FormData>) {
  const errors = ref<FormErrors>({});
  const touched = ref<TouchedFields>({
    title: false,
    body: false,
    userId: false,
  });
  const isSubmitted = ref(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.value.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.value.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.value.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.value.body.trim()) {
      newErrors.body = "Content is required";
    } else if (formData.value.body.length < 10) {
      newErrors.body = "Content must be at least 10 characters";
    }

    if (!formData.value.userId) {
      newErrors.userId = "Please select an author";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const touchField = (field: keyof TouchedFields) => {
    touched.value[field] = true;
  };

  const touchAll = () => {
    for (const field of Object.keys(touched.value)) {
      touched.value[field as keyof TouchedFields] = true;
    }
  };

  const resetValidation = () => {
    errors.value = {};
    touched.value = {
      title: false,
      body: false,
      userId: false,
    };
    isSubmitted.value = false;
  };

  const setSubmitted = () => {
    isSubmitted.value = true;
    validateForm();
  };

  watch(formData, validateForm, { deep: true });

  const isValid = computed(() => Object.keys(errors.value).length === 0);

  const visibleErrors = computed(() => ({
    title: touched.value.title || isSubmitted.value ? errors.value.title : undefined,
    body: touched.value.body || isSubmitted.value ? errors.value.body : undefined,
    userId: touched.value.userId || isSubmitted.value ? errors.value.userId : undefined
  }));

  return {
    errors: visibleErrors,
    isValid,
    touchField,
    touchAll,
    resetValidation,
    setSubmitted
  };
}