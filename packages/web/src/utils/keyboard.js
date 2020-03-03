import { KEY_CODES } from '@commun/ui';

// eslint-disable-next-line consistent-return
function getCodeByKey(key) {
  switch (key) {
    case 'Enter':
      return KEY_CODES.ENTER;
    case 'Escape':
      return KEY_CODES.ESC;
    case 'Backspace':
      return KEY_CODES.BACKSPACE;
    default:
  }
}

export function isKeyModified(e) {
  return e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
}

export function checkPressedKey(e, isExact = false) {
  if (isExact && isKeyModified(e)) {
    return null;
  }

  return e.which || e.keyCode || getCodeByKey(e.key);
}

export function isExactKey(e, which) {
  return !isKeyModified(e) && e.which === which;
}
