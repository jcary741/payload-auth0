import { AuthStrategy, AuthStrategyResult, JsonObject, parseCookies, TypeWithID, User } from "payload";
import type { CollectionSlug, Payload } from "payload";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { PluginTypes } from "../types";



// Create authentication strategy
export const createAuthStrategy = (
  pluginOptions: PluginTypes,
  subFieldName: string
): AuthStrategy => ({
  name: pluginOptions.strategyName || "auth0",
  authenticate: auth0Authenticate
});
// Helper function: Verifies the JWT token and extracts the user payload
const verifyUserToken = (token: string, secret: string): jwt.JwtPayload | null => {
  try {
    const hashedKey = crypto
      .createHash("sha256")
      .update(secret)
      .digest("hex")
      .slice(0, 32);
    const jwtUser = jwt.verify(token, hashedKey, { algorithms: ["HS256"] });

    return typeof jwtUser === "string" ? null : (jwtUser as jwt.JwtPayload);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) return null;
    throw e; // Re-throw non-expired token errors
  }
};

// Extracted function to find or register a user
export const findOrRegisterUser = async (
  payload: Payload,
  collectionSlug: CollectionSlug,
  userToCheck: any
): Promise<(JsonObject & TypeWithID) | null> => {
  const users = await payload.find({
    collection: collectionSlug,
    where: { email: { equals: userToCheck.email } },
    showHiddenFields: true
  });

  if (users.docs?.length) {
    const user = users.docs[0];
    user.collection = collectionSlug;
    user._strategy = "auth0";
    return user;
  }

  const randomPassword = crypto.randomBytes(20).toString("hex"); // Generate secure random password
  const newUser = await payload.create({
    collection: collectionSlug,
    data: {
      ...userToCheck,
      password: randomPassword
    },
    showHiddenFields: true
  });

  return newUser || null;
};

// Refactored Auth0 strategy
export const auth0Authenticate = async ({
                                          payload,
                                          headers
                                        }: {
  payload: Payload;
  headers: Headers;
}): Promise<AuthStrategyResult> => {
  const cookie = parseCookies(headers);
  const token = cookie.get(`${payload.config.cookiePrefix}-token`);
  if (!token) return { user: null };

  const jwtUser = verifyUserToken(token, payload.config.secret);
  if (!jwtUser) return { user: null };

  const collectionSlug: CollectionSlug = "users";
  const verifiedUser = await findOrRegisterUser(payload, collectionSlug, jwtUser as { email: string });

  // @ts-ignore
  return { user: verifiedUser || null };
};

