/* eslint-disable import/prefer-default-export */

export async function getDynamicComponentInitialProps(OriginalComponent, params) {
  let Comp = OriginalComponent;

  if (Comp.preload) {
    Comp = (await Comp.preload()).default;
  }

  if (Comp.getInitialProps) {
    return Comp.getInitialProps(params);
  }

  return null;
}
