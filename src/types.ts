import { PayloadComponent } from "payload";

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
}

export interface ButtonTypes {
  text?: string;
  className?: string;
  component?: PayloadComponent
}

export interface NewCollectionTypes {
  title: string;
}
