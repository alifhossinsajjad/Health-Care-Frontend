/**
 * Clinical AI Error Sanitizer
 * Transforms raw backend / LLM / JSON stack traces into clean, patient-friendly clinical messages.
 */
export function sanitizeAiErrorMessage(rawError: unknown): string {
  if (!rawError) {
    return "AI analysis could not be completed at this time. Please try again.";
  }

  const errorStr =
    typeof rawError === "string"
      ? rawError
      : (rawError as any)?.message ||
        (rawError as any)?.error?.message ||
        JSON.stringify(rawError);

  const lower = errorStr.toLowerCase();

  // 1. High Demand / 503 / Quota / Rate limit
  if (
    lower.includes("503") ||
    lower.includes("high demand") ||
    lower.includes("spikes in demand") ||
    lower.includes("unavailable") ||
    lower.includes("resource_exhausted") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("too many requests") ||
    lower.includes("busy")
  ) {
    return "Our clinical AI analysis service is currently experiencing high demand. Please try again in a few moments.";
  }

  // 2. Unclear document / Legibility / Visual parsing
  if (
    lower.includes("clarity") ||
    lower.includes("cannot read") ||
    lower.includes("illegible") ||
    lower.includes("blurry") ||
    lower.includes("invalid image") ||
    lower.includes("unsupported image") ||
    lower.includes("could not extract")
  ) {
    return "Could not clearly read the document. Please upload a well-lit, flat, and focused image or PDF of your report.";
  }

  // 3. Network or Timeout
  if (
    lower.includes("timeout") ||
    lower.includes("econnrefused") ||
    lower.includes("network") ||
    lower.includes("abort") ||
    lower.includes("econnreset")
  ) {
    return "Medical analysis server took too long to respond. Please check your connection and try again.";
  }

  // 4. File size / format
  if (lower.includes("file exceeds") || lower.includes("too large")) {
    return "File size exceeds the 20MB limit. Please compress or crop your document.";
  }
  if (lower.includes("invalid file") || lower.includes("mime")) {
    return "Invalid file format. Please upload a PDF, PNG, JPEG, or WebP document.";
  }

  // 5. If it looks like raw JSON, never expose raw JSON to users
  if (errorStr.trim().startsWith("{") || errorStr.includes('{"error"')) {
    try {
      const parsed = JSON.parse(
        errorStr.slice(errorStr.indexOf("{"), errorStr.lastIndexOf("}") + 1),
      );
      if (parsed?.error?.message) {
        return sanitizeAiErrorMessage(parsed.error.message);
      }
      if (parsed?.message) {
        return sanitizeAiErrorMessage(parsed.message);
      }
    } catch {
      // Fallback
    }
    return "The AI analysis encountered a temporary processing issue. Please try again.";
  }

  // If there's an internal model name or technical prefix in the string, strip it
  if (
    lower.includes("vision extraction unavailable") ||
    lower.includes("model endpoints") ||
    lower.includes("gemini")
  ) {
    return "Our clinical AI analysis service is currently unavailable. Please try again shortly.";
  }

  return errorStr.length > 120
    ? "Unable to complete AI analysis. Please verify your document is clear and try again."
    : errorStr;
}
