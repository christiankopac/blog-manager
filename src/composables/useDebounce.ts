import { ref, watch } from 'vue'

export function useDebounce<T>(value: T, delay = 300) {
  const debouncedValue = ref(value)
  let timeout: ReturnType<typeof setTimeout>

  watch(
    () => value,
    (newValue) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    }
  )

  return debouncedValue
}