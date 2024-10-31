import { ref } from 'vue'

interface FormPayload {
  title: string
  body: string
  userId: number
}

type EmitFunction = {
  (e: 'save', payload: FormPayload & { id?: number }): void
  (e: 'close'): void
}

export function useFormSubmit(emit: EmitFunction) {
  const isSaving = ref(false)

  const handleSubmit = async (formPayload: FormPayload, postId?: number) => {
    isSaving.value = true
    try {
      const payload = postId ? { ...formPayload, id: postId } : formPayload
      await emit('save', payload)
      emit('close')
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    handleSubmit
  }
}