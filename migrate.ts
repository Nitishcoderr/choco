import { connection, db } from "@/lib/db/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";

(async () => {
    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log("Migration completed successfully");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await connection.end();
    }
})();