import { connect } from 'react-redux';

import { currentUnsafeUserEntitySelector } from 'store/selectors/auth';

import ArticleEditorWindow from './ArticleEditorWindow';

export default connect(state => ({
  user: currentUnsafeUserEntitySelector(state),
}))(ArticleEditorWindow);
