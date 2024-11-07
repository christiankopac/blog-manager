import { ref, watch } from 'vue'

/**
 * Custom composable to debounce a value.
 * 
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds (default is 300ms).
 * @returns A ref containing the debounced value.
 */
export function useDebounce<T>(value: T, delay = 300) {
  // Create a ref to store the debounced value
  const debouncedValue = ref(value)
  
  // Variable to store the timeout ID
  let timeout: ReturnType<typeof setTimeout>

  // Watch the input value for changes
  watch(
    () => value,
    (newValue) => {
      // Clear the previous timeout
      clearTimeout(timeout)
      
      // Set a new timeout to update the debounced value after the specified delay
      timeout = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    }
  )

  // Return the debounced value
  return debouncedValue
}