export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean;

  strategyName: string;


  /**
   * The Collection that the Publish Authorisation will be added to
   * @default "pages"
   */
  authCollection?: string;

  subFieldName?: string;

  useEmailAsIdentity?: boolean;


}

export interface NewCollectionTypes {
  title: string;
}
