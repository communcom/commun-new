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

const ErrorBody = styled.p`
  line-height: 18px;
  font-size: 14px;
`;

export default function CommentBody({ comment }) {
  if (comment.isDeleted) {
    return <ErrorBody>Comment was deleted</ErrorBody>;
  }

  if (!comment.document) {
    return <ErrorBody>Invalid comment format</ErrorBody>;
  }

  return <BodyRenderStyled content={comment.document} />;
}

CommentBody.propTypes = {
  comment: extendedCommentType.isRequired,
};
