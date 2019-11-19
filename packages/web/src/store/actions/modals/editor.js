import { openModal } from 'redux-modals-manager';

import { SHOW_MODAL_NEW_POST_EDITOR } from 'store/constants';

// eslint-disable-next-line import/prefer-default-export
export const openModalEditor = (options = {}) => openModal(SHOW_MODAL_NEW_POST_EDITOR, options);
