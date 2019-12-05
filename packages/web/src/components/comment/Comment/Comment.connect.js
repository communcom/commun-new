import { extendedPostCommentSelector } from 'store/selectors/common';

import makeConnector from '../makeConnector';

import Comment from './Comment';

export default makeConnector(extendedPostCommentSelector)(Comment);
