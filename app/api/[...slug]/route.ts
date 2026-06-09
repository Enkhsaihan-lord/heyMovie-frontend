export const runtime = 'edge'

import { type NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const url = new URL(`/api/${slug.join('/')}`, BACKEND_URL)
  const contentType = request.headers.get('Content-Type') ?? 'application/json'
  const body = await request.arrayBuffer()
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body,
  })
  const data = await res.text()
  return new Response(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const url = new URL(`/api/${slug.join('/')}`, BACKEND_URL)
  request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  const data = await res.text()
  return new Response(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const url = new URL(`/api/${slug.join('/')}`, BACKEND_URL)
  const body = await request.text()
  const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: body || undefined,
  })
  const data = await res.text()
  return new Response(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
