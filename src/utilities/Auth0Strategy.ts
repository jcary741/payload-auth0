import { AuthStrategy, AuthStrategyResult, parseCookies, User } from "payload";
import type { CollectionSlug, Payload } from "payload"

import crypto from 'crypto'
import jwt from "jsonwebtoken";
import { PluginTypes } from "../types";



export const createAuthStrategy = (
  pluginOptions: PluginTypes,
  subFieldName: string,
): AuthStrategy => {
  const authStrategy: AuthStrategy = {
    name: pluginOptions.strategyName || "auth0",
    authenticate: Auth0Strategy
  };
  return authStrategy;
}



export const Auth0Strategy = async ({payload, headers}: {payload: Payload, headers: Headers}): Promise<AuthStrategyResult> => {
  const cookie = parseCookies(headers);
  const token = cookie.get(`${payload.config.cookiePrefix}-token`);
  if (!token) return { user: null };

  const collectionSlug = "users" as CollectionSlug;

  // /////////////////////////////////////
  // Verify user based on token.
  // /////////////////////////////////////
  let jwtUser: jwt.JwtPayload | string;
  try {
    jwtUser = jwt.verify(
      token,
      crypto
        .createHash("sha256")
        .update(payload.config.secret)
        .digest("hex")
        .slice(0, 32),
      { algorithms: ["HS256"] },
    );
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) return { user: null };
    throw e;
  }
  if (typeof jwtUser === "string") return { user: null };

  // //////////////////////////////////////
  // Find or create user in the database
  // //////////////////////////////////////
  let verifiedUser = await findOrCreateUser(payload, collectionSlug, jwtUser) as User;
  return { user: verifiedUser || null }
}

// Helper function to find or create user
export const findOrCreateUser = async (payload:Payload, collectionSlug:CollectionSlug, userToCheck:any) => {

  let users = await payload.find({
    collection: collectionSlug,
    where: { email: { equals: userToCheck.email } },
    showHiddenFields: true,
  });

  let user = null
  // If user exists, return the user
  if (users.docs && users.docs.length) {
    user = users.docs[0];
    user.collection = collectionSlug;
    user._strategy = "auth0";
    return user;
  } else {
    // Generate a secure random password
    const randomPassword = crypto.randomBytes(20).toString('hex');

    // Register new user
    user = await payload.create({
      collection: collectionSlug,
      data: {
        ...userToCheck,
        password: randomPassword,
      },
      showHiddenFields: true,
    });
  }

  return user || false;
}
