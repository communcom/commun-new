import breakpoints from '../themes/common/breakpoints';

export const between = (breakStart, breakEnd) =>
  `@media (min-width: ${breakpoints[breakStart]}) and (max-width: ${breakpoints[breakEnd]})`;

export const up = {
  mobileLandscape: `@media (min-width: ${breakpoints.mobileLandscape}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
};
