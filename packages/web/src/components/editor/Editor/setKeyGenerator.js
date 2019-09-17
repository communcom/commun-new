// eslint-disable-next-line import/no-extraneous-dependencies
import { KeyUtils } from 'slate';

let key = 0;

// for ssr of slate - https://docs.slatejs.org/slate-core/utils#keyutils-setgenerator
KeyUtils.setGenerator(() => {
  key += 1;
  return key.toString();
});
