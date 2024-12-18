import { NextResponse } from "next/server"
import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  async onCallback(error, context, session) {
    // redirect the user to a custom error page
    if (error) {
      // return NextResponse.redirect(`/admin/login?error=${error.message}`)

      return NextResponse.redirect(
        new URL(`/admin/login?error=${error.message}`, process.env.APP_BASE_URL || window.location.origin)
      )
    }

    // Redirect to the generate endpoint to create a payload
    // specific cookie for the session.

    // return NextResponse.redirect(`/api/auth0/generate`)
    return NextResponse.redirect(
      new URL("/api/auth0/generate", process.env.APP_BASE_URL || window.location.origin)
    )
  }
})


