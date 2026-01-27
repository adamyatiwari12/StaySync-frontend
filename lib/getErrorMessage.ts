import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string })?.message ||
      "Request failed"
    );
  }
  return "Unexpected error occurred";
}
