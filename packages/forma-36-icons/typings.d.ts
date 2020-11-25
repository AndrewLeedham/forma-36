/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.mdx' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };

  const url: string;
  export default url;
}

declare module '@storybook/addon-knobs' {
  export const select: any;
  export const text: any;
  export const boolean: any;
  export const number: any;
  export const color: any;
  export const object: any;
  export const array: any;
  export const button: any;
}

declare module '@storybook/addon-knobs/react' {
  export const text: any;
}

declare module '@storybook/addon-actions' {
  export const action: any;
}

declare module '*.css' {
  const value: { [key: string]: string };
  export default value;
}