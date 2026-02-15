# 🔗 Tiny Link

Tiny Link is a minimal URL shortener built with Next.js, Prisma, and Postgres. Submit a long URL and get a short, shareable link that redirects to the original address.


## Features

- Short, unique `urlId` tokens
- Storage using Postgres via Prisma
- Simple web UI to create and copy tiny links
- API endpoints for creating and resolving short URLs


## API

Create a short URL

- Endpoint: `POST /api/url`
- Body: JSON `{ "originalUrl": "https://example.com/some/long/path" }`
- Response: `{ "tinyUrl": "http://localhost:3000/api/url/abc123", "urlId": "abc123", "originalUrl": "..." }`

Resolve/redirect a short URL

- Endpoint: `GET /api/url/:id`
- Behavior: Redirects (302) to the original URL if found, otherwise returns 404 JSON.

Example cURL to create a tiny link:

```bash
curl -X POST -H "Content-Type: application/json" \
	-d '{"originalUrl":"https://www.example.com/long/path"}' \
	http://localhost:3000/api/url
```