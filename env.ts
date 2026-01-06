import { type ZodError, z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PROJECT_DOMAIN: z.string().min(1).default("kosice"),
  DATABASE_URL: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(8),
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://www.nicokosice.sk"),
});

type Env = z.infer<typeof EnvSchema>;

function validateEnv(): Env {
  try {
    return EnvSchema.parse(process.env);
  } catch (e) {
    const err = e as ZodError;
    console.error("❌ Invalid ENV:");
    console.error(JSON.stringify(z.treeifyError(err), null, 2));
    throw new Error("Invalid environment variables");
  }
}

const env = validateEnv();

export default env;
