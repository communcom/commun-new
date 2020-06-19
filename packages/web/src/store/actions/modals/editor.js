import { openModal } from 'store/actions/modals/common';
import { SHOW_MODAL_CHOOSE_POST_COVER, SHOW_MODAL_NEW_POST_EDITOR } from 'store/constants';

export const openModalEditor = (options = {}) => openModal(SHOW_MODAL_NEW_POST_EDITOR, options);

export const choosePostCover = (options = {}) => openModal(SHOW_MODAL_CHOOSE_POST_COVER, options);
