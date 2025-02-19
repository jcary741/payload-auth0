import { BasePayload, Payload, PayloadComponent } from "payload";
import { SessionData } from "@auth0/nextjs-auth0/types";

export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean;

  strategyName?: string;

  /**
   * The Collection that the Publish Authorisation will be added to
   * @default "pages"
   */
  authCollection?: string;

  subFieldName?: string;

  useEmailAsIdentity?: boolean;

  button?: ButtonTypes;


  /**
   * Object to map existing fields to the User Collection
   */
  mapMetaFields?: object


  // Hooks to run functions at points
  hooks?: PluginHooks
}

interface PluginHooks {
  afterLogin?: {
    handler: (session: SessionData, payload: BasePayload) => void;
  };
}

export interface ButtonTypes {
  text?: string;
  className?: string;
  component?: PayloadComponent
}

export interface NewCollectionTypes {
  title: string;
}
