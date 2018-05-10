// Type definitions for redux-devtools 3.4.1
// TypeScript Version: 2.8.1

import * as React from "react";
import { StoreEnhancer } from "redux";

export interface DevTools {
  new (): JSX.ElementClass;
  instrument(opts?: any): StoreEnhancer<any>;
}

export declare function createDevTools(el: React.ReactElement<any>): DevTools;
export declare function persistState(
  debugSessionKey: string
): StoreEnhancer<any>;

declare const factory: { instrument(opts?: any): () => StoreEnhancer<any> };

export default factory;
