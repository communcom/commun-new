import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedCommentType } from 'types';

import CommentForm from 'components/common/CommentForm';
import CommentAvatar from '../CommentAvatar';

const Wrapper = styled.div``;

export default function EditInput({ comment, inPost, className, onClose }) {
  return (
    <Wrapper isNested={Boolean(comment.parents.comment)} className={className}>
      <CommentAvatar inPost={inPost} />
      <CommentForm
        contentId={comment.contentId}
        parentPostId={comment.parents.post}
        comment={comment}
        community={comment.community}
        isEdit
        autoFocus
        onClose={onClose}
        onDone={onClose}
      />
    </Wrapper>
  );
}

EditInput.propTypes = {
  comment: extendedCommentType.isRequired,
  inPost: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

EditInput.defaultProps = {
  inPost: false,
};
