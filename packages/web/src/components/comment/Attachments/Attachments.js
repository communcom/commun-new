import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { extendedCommentType } from 'types';
import AttachmentsBlock from 'components/common/AttachmentsBlock';

const AttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  margin-top: 24px;
  overflow: hidden;

  ${is('inPost')`
    margin-top: 10px;
  `};
`;

export default function Attachments({ className, comment, inPost, isComment }) {
  if (!comment.document) {
    return null;
  }

  const { content } = comment.document;
  const attachments = content.find(({ type }) => type === 'attachments');

  if (!attachments) {
    return null;
  }

  return (
    <AttachmentsWrapper className={className} inPost={inPost}>
      <AttachmentsBlock attachments={attachments} isComment={isComment} />
    </AttachmentsWrapper>
  );
}

Attachments.propTypes = {
  comment: extendedCommentType.isRequired,
  inPost: PropTypes.bool,
  isComment: PropTypes.bool,
};

Attachments.defaultProps = {
  inPost: false,
  isComment: false,
};
