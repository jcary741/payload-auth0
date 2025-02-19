import type { Plugin } from "payload";
import type { PluginTypes } from "./types";

import { generateRoute } from "./utilities/generate-route";
import { modifyAuthCollection } from "./utilities/modify-auth-collection";

export const Auth0Plugin = (pluginOptions: PluginTypes): Plugin => {
  return (incomingConfig) => {
    let config = { ...incomingConfig };

    if (pluginOptions.enabled === false) {
      return config;
    }

    // /////////////////////////////////////
    // Modify auth collection
    // /////////////////////////////////////
    const authCollectionSlug = pluginOptions.authCollection || "users";
    const subFieldName = pluginOptions.subFieldName || "sub";
    const authCollection = config.collections?.find(
      (collection) => collection.slug === authCollectionSlug,
    );
    if (!authCollection) {
      throw new Error(
        `The collection with the slug "${authCollectionSlug}" was not found.`,
      );
    }
    const modifiedAuthCollection = modifyAuthCollection(
      pluginOptions,
      authCollection,
      subFieldName,
    );

    config.collections = [
      ...(config.collections?.filter(
        (collection) => collection.slug !== authCollectionSlug,
      ) || []),
      modifiedAuthCollection,
    ];

    config.endpoints = [
      ...(config.endpoints || []),
      {
        path: "/auth0/generate",
        method: "get",
        handler: async (req) => {
          return await generateRoute(req, pluginOptions);
        },
      },
    ];

    // Add After login button
    const addAfterLoginComponent = (adminConfig: any): any => ({
      ...adminConfig,
      components: {
        ...adminConfig.components,
        afterLogin: [
          ...(adminConfig.components?.afterLogin || []),
          // "payload-auth0#LoginButton",
          pluginOptions?.button?.component || {
            path: "payload-auth0#LoginButton",
            clientProps: {
              text: pluginOptions?.button?.text || "Login with Auth0",
              className:
                pluginOptions?.button?.className ||
                "btn btn--style-secondary btn--icon-style-without-border btn--size-medium",
            },
          },
        ],
      },
    });

    if (config.admin) {
      config.admin = addAfterLoginComponent(config.admin);
    }

    return config;
  };
};

export default Auth0Plugin;
