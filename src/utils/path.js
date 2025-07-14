import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Fallback untuk runtime yang tidak mendukung import.meta.url
export const __filename = process.cwd();
export const __dirname = dirname(__filename);
