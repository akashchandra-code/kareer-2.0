function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // App
  PORT: Number(process.env.PORT || 5001),

  //Gemini
  GEMINI_KEY: required("GEMINI_KEY"),

  // Auth
  JWT_SECRET: required("JWT_SECRET"),
};