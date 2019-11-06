/* eslint-disable import/prefer-default-export */

export async function getDynamicComponentInitialProps(OriginalComponent, params) {
  let Comp = OriginalComponent;

  // This is for 'next/dynamic' compatible
  if (Comp.render && Comp.render.preload) {
    Comp = (await Comp.render.preload()).default;
  }

  if (Comp.preload) {
    Comp = (await Comp.preload()).default;
  }

  if (Comp.getInitialProps) {
    return Comp.getInitialProps(params);
  }

  return null;
}
