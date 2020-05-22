declare module 'jss' {
  import * as css from 'csstype';

  // TODO: Type data better, currently typed as any for allowing to override it
  type FnValue<R> = R | ((data: any) => R);

  type NormalCssProperties = css.Properties<string | number>;
  type CssProperties = {
    [K in keyof NormalCssProperties]: FnValue<NormalCssProperties[K]>;
  };

  // Jss Style definitions
  type JssStyleP<S> = CssProperties & {
    [key: string]: FnValue<JssValue | S>;
  };

  export type JssStyle = JssStyleP<
    JssStyleP<JssStyleP<JssStyleP<JssStyleP<JssStyleP<JssStyleP<void>>>>>>
  >;

  export type Styles<Name extends string | number | symbol = string> = Record<
    Name,
    JssStyle | string
  >;
  export type Classes<Name extends string | number | symbol = string> = Record<
    Name,
    string
  >;

  export type JssValue =
    | string
    | number
    | Array<string | number | Array<string | number> | '!important'>
    | null
    | false;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Plugin {}

  export interface StyleSheet<
    RuleName extends string | number | symbol = string | number | symbol
  > {
    classes: Classes<RuleName>;
    attach(): this;
    detach(): this;
  }

  export interface Jss {
    createStyleSheet<Name extends string | number | symbol>(
      styles: Partial<Styles<Name>>
    ): StyleSheet<Name>;
    use(...plugins: Plugin[]): this;
  }

  const jss: Jss;
  export default jss;
}
