import type { Plugin } from 'payload'
import type { PluginTypes } from './types'

import { modifyAuthCollection } from "./utilities/modify-auth-collection";
import { generateRoute } from "./utilities/generate-route";

export const Auth0Plugin =
  (pluginOptions: PluginTypes): Plugin =>
    (incomingConfig) => {
      let config = { ...incomingConfig }

      if (pluginOptions.enabled === false) {
        return config
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
          path: '/auth0/generate',
          method: 'get',
          handler: async (req) => {
            return await generateRoute(req)
          }
        }


      ]



      // Add After login button
      const addAfterLoginComponent = (adminConfig: any): any => ({
        ...adminConfig,
        components: {
          ...adminConfig.components,
          afterLogin: [
            ...(adminConfig.components?.afterLogin || []),
            "payload-auth0#LoginButton",
          ],
        },
      });

      if (config.admin) {
        config.admin = addAfterLoginComponent(config.admin);
      }



      return config
    }

export default Auth0Plugin
