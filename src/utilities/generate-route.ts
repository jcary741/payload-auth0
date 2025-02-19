// /////////////////////////////////////////////////
// Generate cookie from session data here...
// /////////////////////////////////////////////////
import { auth0 } from "./AuthClient"
import { NextResponse } from 'next/server'

import {
  CollectionSlug,
  PayloadRequest,
  generatePayloadCookie,
  getFieldsToSign,
  User, Payload
} from "payload";
import { findOrRegisterUser } from "./Auth0Strategy";
import jwt from "jsonwebtoken";
import { PluginTypes } from "../types";

const collectionSlug: CollectionSlug = "users"; // Extracted as constant

/**
 * Creates and returns a signed session token for a user.
 * Extracted to simplify the main logic of `generateRoute`.
 */
async function createUserSessionToken(
  payload: Payload,
  collectionConfig: any,
  secret: string,
  userInfo: { email?: string; sub?: string }
): Promise<string> {
  // Find or create the user
  const existingUser = {
    ...await findOrRegisterUser(payload, collectionSlug, userInfo),
    collection: collectionSlug
  } as User;

  // Get fields required for the token signature
  const signedFields = getFieldsToSign({
    collectionConfig,
    email: existingUser.email || "",
    user: existingUser
  });

  // Sign the token
  return jwt.sign(signedFields, secret, {
    expiresIn: collectionConfig.auth.tokenExpiration
  });
}

// Main route generation function
export async function generateRoute(req: PayloadRequest, config: PluginTypes) {
  const session = await auth0.getSession();
  if (!session?.user) {
    throw new Error("User session not found");
  }

  const { payload } = req;
  const collectionConfig = payload.collections[collectionSlug].config;
  const payloadConfig = payload.config;
  // Extract user info from the session
  const userInfo = {
    email: session.user.email,
    sub: session.user.sub
  };

  // if config hooks.afterlogin
  if (config?.hooks && config?.hooks?.afterLogin) {
    config?.hooks?.afterLogin?.handler(session, payload)
  }


  // Generate the session token
  const token = await createUserSessionToken(
    payload,
    collectionConfig,
    payload.secret,
    userInfo
  );

  // Generate the payload cookie
  const cookie = generatePayloadCookie({
    collectionAuthConfig: collectionConfig.auth,
    cookiePrefix: payloadConfig.cookiePrefix,
    token
  });

  // Redirect to admin with the generated cookie
  const redirectUrl = new URL("/admin", process.env.APP_BASE_URL); // Extracted as constant
  return NextResponse.redirect(redirectUrl, {
    headers: {
      "Set-Cookie": cookie
    }
  });
}
