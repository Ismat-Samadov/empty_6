# Kreditor.az

Azərbaycan bazarı üçün mərkəzləşdirilmiş kredit müraciəti platforması.
Müştərilər bir dəfə məlumat doldurub bir neçə banka eyni anda kredit müraciəti göndərə bilərlər.

## Xüsusiyyətlər

- Bir müraciətlə çox banka kredit ərizəsi
- PWA — veb saytdan masa üstü proqram kimi yüklənə bilir
- Hər bank üçün ayrıca admin paneli və analitika
- Azərbaycan dili

## Texnologiyalar

| Sahə | Texnologiya |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Verilənlər bazası | NeonTech PostgreSQL |
| ORM | Drizzle ORM |
| Object Storage | Cloudflare R2 |
| E-poçt | Resend |
| Hosting | Vercel |

## Quraşdırma

```bash
npm install
```

## Mühit dəyişənləri

`.env.local` faylını yaradın:

```env
DATABASE_URL="postgresql://..."

R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_URL=""

RESEND_API_KEY=""

NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

## Verilənlər bazası

```bash
# Miqrasiyanı yaradın
npm run db:generate

# Miqrasiyanı tətbiq edin
npm run db:migrate

# Bankları seed edin
npm run db:seed

# Drizzle Studio (vizual redaktor)
npm run db:studio
```

## İşə salın

```bash
npm run dev
```

## DB Sxemi

Bütün cədvəllər `kreditor` sxemi altında yerləşir:

- `kreditor.banks` — bank profillər
- `kreditor.bank_admins` — bank admin istifadəçiləri
- `kreditor.loan_applications` — müştəri müraciətləri
- `kreditor.application_banks` — müraciət ↔ bank (hər bank üçün ayrıca status)
