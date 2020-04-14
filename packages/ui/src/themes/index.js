import { mergeDeepRight } from 'ramda';

import common from './common';
import mainTheme from './main';
import darkTheme from './dark';

const main = Object.assign({}, common, mainTheme);
const dark = mergeDeepRight(main, darkTheme);

export default {
  main,
  dark,
};
