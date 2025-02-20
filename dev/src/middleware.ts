import { NextRequest, NextResponse} from 'next/server'

import { auth0 } from "payload-auth0/node"

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    "/(auth|admin)/(login|logout|callback|profile|access-token|backchannel-logout)",
  ],
}
