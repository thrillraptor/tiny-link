
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: 'No id provided' }, { status: 400 });
    }
    const url = await prisma.url.findUnique({ where: { urlId: id } });
    if (!url) {
        return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }
    return NextResponse.redirect(url.originalUrl);
}
