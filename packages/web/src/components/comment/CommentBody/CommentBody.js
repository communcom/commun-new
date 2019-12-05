import React from 'react';
import styled from 'styled-components';

import { extendedCommentType } from 'types';
import BodyRender from 'components/common/BodyRender';

const BodyRenderStyled = styled(BodyRender)`
  display: inline;

  &,
  & p,
  & span {
    font-size: 13px;
    line-height: 18px;
  }

  & p:first-of-type {
    display: inline;
  }

  & a {
    font-weight: 600;
  }
`;

export default function CommentBody({ comment }) {
  if (comment.isDeleted) {
    return 'Comment was deleted';
  }

  if (!comment.document) {
    return 'Invalid comment format';
  }

  return <BodyRenderStyled content={comment.document} />;
}

CommentBody.propTypes = {
  comment: extendedCommentType.isRequired,
};
