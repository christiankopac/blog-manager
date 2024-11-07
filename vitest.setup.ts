import { vi } from "vitest";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock window and document if they don't exist
if (typeof window === "undefined") {
  vi.stubGlobal("window", {});
}

if (typeof document === "undefined") {
  vi.stubGlobal("document", {});
}

// This setup file:
// - Imports Vitest testing utilities
// - Mocks IntersectionObserver API:
//   - Creates mock function
//   - Implements required methods
//   - Assigns to window object
// - Handles missing browser globals:
//   - Checks for window/document
//   - Stubs missing globals
// - Enables DOM-dependent tests

// Purpose:
// - Provides test environment setup
// - Mocks browser APIs
// - Ensures consistent testing environment