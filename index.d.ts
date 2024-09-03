export {}

declare module "solid-js" {
    namespace JSX {
      interface Directives {
        clickOutside: () => void;
        size: (width: number, height: number) => void;
      }
    }
  }