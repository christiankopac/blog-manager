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