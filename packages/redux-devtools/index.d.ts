// Redux version 4.0.0
// Type definitions for redux-devtools 3.4.1
// TypeScript Version: 2.8.1

import * as React from 'react';
import { StoreEnhancer } from 'redux';

export interface DevTools {
  new (): JSX.ElementClass;
  instrument(opts?: any): StoreEnhancer;
}

export declare function createDevTools(el: React.ReactElement<any>): DevTools;
export declare function persistState(debugSessionKey: string): StoreEnhancer;

declare const factory: { instrument(opts?: any): () => StoreEnhancer };

export default factory;
