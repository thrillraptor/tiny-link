import { PrismaClient } from "@/app/generated/prisma/client";
import { permanentRedirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = await prisma.shortURL.findUnique({
    where: {
      slug: slug,
    },
  });
  if (url) {
    permanentRedirect(url.originalUrl);
  }
  return NextResponse.json({ error: "URL not found." }, { status: 404 });
}
