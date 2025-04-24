import { PrismaClient } from "@/app/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  const slug = Math.random().toString(36).substring(2, 8);

  await prisma.shortURL.create({
    data: { slug, originalUrl: url },
  });

  return NextResponse.json(
    {
      shorten: `${process.env.NEXT_PUBLIC_BASE_URL}/api/${slug}`,
    },
    { status: 200 }
  );
}
