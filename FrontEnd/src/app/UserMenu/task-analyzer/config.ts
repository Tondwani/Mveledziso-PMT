export interface APIConfig {
  GEMINI_API_KEY: string | undefined;
  GEMINI_API_URL: string | undefined;
}

export const API_CONFIG: APIConfig = {
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  GEMINI_API_URL: process.env.NEXT_PUBLIC_GEMINI_API_URL
};
