import { connect } from 'react-redux';

import { feedImageWidthSelector } from 'store/selectors/ui';

import ArticleCardBody from './ArticleCardBody';

export default connect(state => ({
  imageWidth: feedImageWidthSelector(state),
}))(ArticleCardBody);
