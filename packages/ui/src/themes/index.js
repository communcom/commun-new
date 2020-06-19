import { mergeDeepRight } from 'ramda';

import common from './common';
import darkTheme from './dark';
import mainTheme from './main';

const main = Object.assign({}, common, mainTheme);
const dark = mergeDeepRight(main, darkTheme);

export default {
  main,
  dark,
};
