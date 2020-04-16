import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { extendedCommentType, contentIdType } from 'types';
import { preparePostWithMention } from 'utils/editor';

import CommentForm from 'components/common/CommentForm';

import CommentAvatar from '../CommentAvatar';

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 16px 0;

  ${is('inPost')`
    padding: 0;
    margin: 16px 0;
  `};
`;

const CommentFormStyled = styled(CommentForm)`
  max-width: calc(100% - 50px);
`;

export default function ReplyInput({
  parentComment,
  rootParentCommentId,
  isOwner,
  inPost,
  replyToCommentId,
  onClose,
}) {
  const { author } = parentComment;

  const defaultValue = !isOwner && author.username ? preparePostWithMention(author.username) : null;

  return (
    <InputWrapper inPost={inPost}>
      <CommentAvatar inPost={inPost} />
      <CommentFormStyled
        parentCommentId={rootParentCommentId}
        visuallyParentCommentId={replyToCommentId}
        parentPostId={parentComment.parents.post}
        defaultValue={defaultValue}
        autoFocus
        isReply
        onDone={onClose}
      />
    </InputWrapper>
  );
}

ReplyInput.propTypes = {
  parentComment: extendedCommentType.isRequired,
  rootParentCommentId: contentIdType.isRequired,
  replyToCommentId: contentIdType.isRequired,
  inPost: PropTypes.bool,
  isOwner: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ReplyInput.defaultProps = {
  inPost: false,
};
