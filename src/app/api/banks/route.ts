import { NextResponse } from "next/server";
import { db } from "@/db";
import { banks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const result = await db
    .select({
      id: banks.id,
      name: banks.name,
      slug: banks.slug,
      logoUrl: banks.logoUrl,
      description: banks.description,
    })
    .from(banks)
    .where(eq(banks.isActive, true))
    .orderBy(banks.name);

  return NextResponse.json(result);
}
