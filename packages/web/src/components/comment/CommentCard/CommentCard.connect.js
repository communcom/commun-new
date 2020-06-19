import { extendedProfileCommentSelector } from 'store/selectors/common';

import makeConnector from '../makeConnector';
import CommentCard from './CommentCard';

export default makeConnector(extendedProfileCommentSelector)(CommentCard);
