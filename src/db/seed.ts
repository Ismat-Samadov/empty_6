import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { banks } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const azerbaijaniBanks = [
  {
    name: "Kapital Bank",
    slug: "kapital-bank",
    description: "Azərbaycanın ən böyük xüsusi bankı",
    websiteUrl: "https://kapitalbank.az",
    phoneNumber: "*1011",
  },
  {
    name: "ABB",
    slug: "abb",
    description: "Azərbaycan Beynəlxalq Bankı",
    websiteUrl: "https://abb-bank.az",
    phoneNumber: "*5050",
  },
  {
    name: "PAŞA Bank",
    slug: "pasa-bank",
    description: "PAŞA Holdinqin maliyyə quruluşu",
    websiteUrl: "https://pashabank.az",
    phoneNumber: "*1801",
  },
  {
    name: "Unibank",
    slug: "unibank",
    description: "Universal Kredit Bankı",
    websiteUrl: "https://unibank.az",
    phoneNumber: "*2525",
  },
  {
    name: "AccessBank",
    slug: "accessbank",
    description: "Azərbaycanın aparıcı mikromaliyyə bankı",
    websiteUrl: "https://accessbank.az",
    phoneNumber: "*8080",
  },
  {
    name: "Bank Respublika",
    slug: "bank-respublika",
    description: "Bank Respublika ASC",
    websiteUrl: "https://bankrespublika.az",
    phoneNumber: "*1234",
  },
  {
    name: "Xalq Bank",
    slug: "xalq-bank",
    description: "Azərbaycan Xalq Bankı",
    websiteUrl: "https://xalqbank.az",
    phoneNumber: "*9090",
  },
  {
    name: "AtaBank",
    slug: "atabank",
    description: "AtaBank ASC",
    websiteUrl: "https://atabank.az",
    phoneNumber: "*7070",
  },
];

async function seed() {
  console.log("Seeding banks...");

  for (const bank of azerbaijaniBanks) {
    await db
      .insert(banks)
      .values(bank)
      .onConflictDoNothing({ target: banks.slug });
    console.log(`  ✓ ${bank.name}`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
