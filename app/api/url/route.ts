import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

function generateUrlId(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        const { originalUrl } = await request.json();

        if (!originalUrl || typeof originalUrl !== 'string') {
            return NextResponse.json({ error: 'Invalid originalUrl' }, { status: 400 });
        }

        try {
            new URL(originalUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        let urlId;
        let exists = true;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            urlId = generateUrlId();
            try {
                const found = await prisma.url.findUnique({ where: { urlId } });
                exists = !!found;
            } catch (dbError) {
                console.error('Database error while checking URL ID:', dbError);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }

            attempts++;
            if (attempts > maxAttempts) {
                return NextResponse.json({ error: 'Failed to generate unique URL ID' }, { status: 500 });
            }
        } while (exists);

        const url = await prisma.url.create({
            data: {
                originalUrl,
                urlId,
                createdAt: new Date()
            },
        });

        // Better way to construct the base URL
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = request.headers.get('host') || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;

        // Construct the full tiny URL
        const tinyUrl = `${baseUrl}/api/url/${urlId}`;

        return NextResponse.json({
            tinyUrl,
            urlId,
            originalUrl: url.originalUrl
        });

    } catch (error) {
        console.error('Error creating short URL:', error);
        return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
    }
}