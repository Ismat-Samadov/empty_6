import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { banks, bankAdmins } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const azerbaijaniBanks = [
  { name: "Kapital Bank", slug: "kapital-bank", description: "Azərbaycanın ən böyük xüsusi bankı", websiteUrl: "https://kapitalbank.az", phoneNumber: "*1011" },
  { name: "ABB", slug: "abb", description: "Azərbaycan Beynəlxalq Bankı", websiteUrl: "https://abb-bank.az", phoneNumber: "*5050" },
  { name: "PAŞA Bank", slug: "pasa-bank", description: "PAŞA Holdinqin maliyyə quruluşu", websiteUrl: "https://pashabank.az", phoneNumber: "*1801" },
  { name: "Unibank", slug: "unibank", description: "Universal Kredit Bankı", websiteUrl: "https://unibank.az", phoneNumber: "*2525" },
  { name: "AccessBank", slug: "accessbank", description: "Azərbaycanın aparıcı mikromaliyyə bankı", websiteUrl: "https://accessbank.az", phoneNumber: "*8080" },
  { name: "Bank Respublika", slug: "bank-respublika", description: "Bank Respublika ASC", websiteUrl: "https://bankrespublika.az", phoneNumber: "*1234" },
  { name: "Xalq Bank", slug: "xalq-bank", description: "Azərbaycan Xalq Bankı", websiteUrl: "https://xalqbank.az", phoneNumber: "*9090" },
  { name: "AtaBank", slug: "atabank", description: "AtaBank ASC", websiteUrl: "https://atabank.az", phoneNumber: "*7070" },
];

// Default bank admin password — CHANGE AFTER FIRST LOGIN
const DEFAULT_ADMIN_PASSWORD = "Bank@1234";

async function seed() {
  console.log("Seeding banks...");
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

  for (const bankData of azerbaijaniBanks) {
    const [existing] = await db
      .insert(banks)
      .values(bankData)
      .onConflictDoNothing({ target: banks.slug })
      .returning({ id: banks.id });

    // Get bank id (either just inserted or already existed)
    const bank = existing ?? (await db.select().from(banks).where(eq(banks.slug, bankData.slug)).limit(1))[0];

    if (!bank) continue;
    console.log(`  ✓ ${bankData.name} (id: ${bank.id})`);

    // Create default admin for each bank
    const adminEmail = `admin@${bankData.slug}.kreditor.az`;
    await db
      .insert(bankAdmins)
      .values({
        bankId: bank.id,
        name: `${bankData.name} Admin`,
        email: adminEmail,
        passwordHash,
        role: "admin",
      })
      .onConflictDoNothing({ target: bankAdmins.email });

    console.log(`    → Admin: ${adminEmail} / ${DEFAULT_ADMIN_PASSWORD}`);
  }

  console.log("\nDone. IMPORTANT: Change admin passwords after first login!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
