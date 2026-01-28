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

  // Database
  MONGO_URI: required("MONGO_URI"),

  // Auth
  JWT_SECRET: required("JWT_SECRET"),

  // Redis
  REDIS_URL: required("REDIS_URL"),

  // ImageKit
  IMAGEKIT_PUBLIC_KEY: required("IMAGEKIT_PUBLIC_KEY"),
  IMAGEKIT_PRIVATE_KEY: required("IMAGEKIT_PRIVATE_KEY"),
  IMAGEKIT_URL_ENDPOINT: required("IMAGEKIT_URL_ENDPOINT"),
};
