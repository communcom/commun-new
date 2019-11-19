import { connect } from 'react-redux';

import { currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';
import { openModalEditor } from 'store/actions/modals';

import ArticleEditorSlot from './ArticleEditorSlot';

export default connect(
  state => ({
    isHydration: uiSelector(['mode', 'isHydration'])(state),
    isArticleEditorOpen: uiSelector(['editor', 'isOpen'])(state),
    isUserLoaded: Boolean(currentUnsafeUserEntitySelector(state)),
  }),
  {
    openModalEditor,
  }
)(ArticleEditorSlot);
