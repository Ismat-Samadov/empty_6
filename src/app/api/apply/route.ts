import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { loanApplications, applicationBanks } from "@/db/schema";
import { z } from "zod";

const schema = z.object({
  phoneNumber: z.string().min(7).max(20),
  finCode: z.string().length(7),
  bankIds: z.array(z.string().uuid()).min(1).max(10),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Yanlış sorğu formatı" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Məlumatlar düzgün deyil. Zəhmət olmasa yoxlayın." },
      { status: 400 }
    );
  }

  const { phoneNumber, finCode, bankIds } = parsed.data;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const [application] = await db
    .insert(loanApplications)
    .values({ phoneNumber, finCode, ipAddress: ip })
    .returning({ id: loanApplications.id });

  await db.insert(applicationBanks).values(
    bankIds.map((bankId) => ({
      applicationId: application.id,
      bankId,
    }))
  );

  return NextResponse.json(
    { success: true, applicationId: application.id },
    { status: 201 }
  );
}
