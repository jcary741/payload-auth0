// /////////////////////////////////////////////////
// Generate cookie from session data here...
// /////////////////////////////////////////////////


// import { getPayload } from 'payload'
// import config from '@/payload.config'
import { auth0 } from "./AuthClient"
import { NextResponse } from 'next/server'

import {
  CollectionSlug,
  PayloadRequest,
  generatePayloadCookie,
  getFieldsToSign, User
} from "payload";
import { findOrCreateUser } from "./Auth0Strategy";
import jwt from "jsonwebtoken";

export async function generateRoute(req: PayloadRequest) {
  const session = await auth0.getSession();
  const payload = await req.payload;

  const collectionSlug = "users" as CollectionSlug;
  const collectionConfig = payload.collections[collectionSlug].config;
  const payloadConfig = payload.config;

  const userInfo = {
    email: session?.user?.email,
    sub: session?.user?.sub,
  };

  const checkUser = {
    ...await findOrCreateUser(payload, collectionSlug, userInfo),
    collection: collectionSlug
  } as User;

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: checkUser.email || "",
    user: checkUser,
  });

  const token = jwt.sign(fieldsToSign, payload.secret, {
    expiresIn: collectionConfig.auth.tokenExpiration,
  });

  // /////////////////////////////////////
  // Generate and set cookie
  // /////////////////////////////////////
  const cookie = generatePayloadCookie({
    collectionAuthConfig: collectionConfig.auth,
    cookiePrefix: payloadConfig.cookiePrefix,
    token,
  });

  return NextResponse.redirect(new URL("/admin", process.env.APP_BASE_URL), {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
