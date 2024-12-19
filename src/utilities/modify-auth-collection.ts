import { AuthStrategy, type CollectionConfig } from "payload";
import { createAuthStrategy } from "./Auth0Strategy";

import { PluginTypes } from "../types";

export const modifyAuthCollection = (
  pluginOptions: PluginTypes,
  existingCollectionConfig: CollectionConfig,
  subFieldName: string,
): CollectionConfig => {
  const EMAIL_FIELD_NAME = "email";
  const SUB_FIELD_NAME = subFieldName;

  // Helper function: Add field if missing
  const addField = (fields: any[], fieldConfig: any, fieldName: string) => {
    if (!fields.some((field) => "name" in field && field.name === fieldName)) {
      fields.push(fieldConfig);
    }
  };

  // Update fields
  const updatedFields = existingCollectionConfig.fields || [];

  // Add sub field
  addField(updatedFields, {
    name: SUB_FIELD_NAME,
    type: "text",
    index: true,
    access: {
      read: () => true,
      create: () => true,
      update: () => false,
    },
  }, SUB_FIELD_NAME);

  // Add email field if necessary
  const shouldAddEmailField =
    existingCollectionConfig.auth !== undefined &&
    typeof existingCollectionConfig.auth !== "boolean" &&
    existingCollectionConfig.auth.disableLocalStrategy === true &&
    pluginOptions.useEmailAsIdentity === true;

  if (shouldAddEmailField) {
    addField(updatedFields, {
      name: EMAIL_FIELD_NAME,
      type: "email",
      required: true,
      unique: true,
      index: true,
    }, EMAIL_FIELD_NAME);
  }

  // Update strategies
  const authStrategy = createAuthStrategy(pluginOptions, SUB_FIELD_NAME);
    const existingStrategies =
    typeof existingCollectionConfig?.auth === "object" &&
    existingCollectionConfig?.auth !== null &&
    Array.isArray(existingCollectionConfig.auth.strategies)
      ? existingCollectionConfig.auth.strategies
      : [];
  const updatedStrategies = [...existingStrategies, authStrategy];

  // Return updated collection config
  return {
    ...existingCollectionConfig,
    fields: updatedFields,
    auth: {
      ...(typeof existingCollectionConfig.auth === "object" &&
      existingCollectionConfig.auth !== null
        ? existingCollectionConfig.auth
        : {}),
      strategies: updatedStrategies,
    },
  };
};
