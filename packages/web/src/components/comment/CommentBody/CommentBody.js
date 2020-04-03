import React from 'react';
import styled from 'styled-components';

import { extendedCommentType } from 'types';
import { useTranslation } from 'shared/i18n';

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
  const { t } = useTranslation();

  if (comment.isDeleted) {
    return <ErrorBody>{t('components.comment.comment_body.deleted')}</ErrorBody>;
  }

  if (!comment.document) {
    return <ErrorBody>{t('components.comment.comment_body.invalid_format')}</ErrorBody>;
  }

  return <BodyRenderStyled content={comment.document} />;
}

CommentBody.propTypes = {
  comment: extendedCommentType.isRequired,
};
