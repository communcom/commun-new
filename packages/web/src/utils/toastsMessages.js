/* eslint-disable no-console, no-param-reassign */

import ToastsManager from 'toasts-manager';

import { i18n } from 'shared/i18n';
import { normalizeCyberwayErrorMessage } from './errors';

export function displaySuccess(text) {
  if (process.browser) {
    ToastsManager.info(text);
  }
}

export function displayError(title, err) {
  if (typeof title !== 'string') {
    err = title;
    title = null;
  }

  let prefix = null;

  if (title) {
    prefix = title;

    if (err && !title.endsWith(':')) {
      prefix = `${prefix}:`;
    }
  }

  if (prefix && err) {
    console.error(prefix, err);
  } else if (err) {
    console.error(err);
  }

  let message = '';

  if (err) {
    message = normalizeCyberwayErrorMessage(err);

    if (message.includes("Message doesn't exist in cashout window")) {
      message = i18n.t('chain_errors.cashout_window');
    } else if (message.includes('incorrect proxy levels: grantor 1, agent 1')) {
      message = i18n.t('chain_errors.incorrect_delegate_proxy_level');
    }
  }

  if (process.browser) {
    ToastsManager.error(`${prefix ? `${prefix} ` : ''}${message}`);
  }
}
