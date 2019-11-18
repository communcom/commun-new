import { connect } from 'react-redux';

import { currentUnsafeUserEntitySelector } from 'store/selectors/auth';
import { uiSelector } from 'store/selectors/common';

import ArticleEditorSlot from './ArticleEditorSlot';

export default connect(state => ({
  isHydration: uiSelector(['mode', 'isHydration'])(state),
  isUserLoaded: Boolean(currentUnsafeUserEntitySelector(state)),
}))(ArticleEditorSlot);
