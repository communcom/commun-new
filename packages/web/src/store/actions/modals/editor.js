import { openModal } from 'store/actions/modals/common';

import { SHOW_MODAL_NEW_POST_EDITOR, SHOW_MODAL_CHOOSE_POST_COVER } from 'store/constants';

export const openModalEditor = (options = {}) => openModal(SHOW_MODAL_NEW_POST_EDITOR, options);

export const choosePostCover = (options = {}) => openModal(SHOW_MODAL_CHOOSE_POST_COVER, options);
