/**
 * This configuration file is used by drizzle to know where to get some necessary infos
 */

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";


config({ path: '.env.local' });

export default defineConfig({
    schema: "./database/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
