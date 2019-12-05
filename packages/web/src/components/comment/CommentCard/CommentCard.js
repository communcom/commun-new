import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { extendedCommentType } from 'types';
import { displayError } from 'utils/toastsMessages';
import VotePanel from 'components/common/VotePanel';
import Avatar from 'components/common/Avatar';

import { useCommentInputState } from '../hooks';
import { ActionButton } from '../common';
import EditInput from '../EditInput';
import ReplyInput from '../ReplyInput';
import DropDownActions from '../DropDownActions';
import CommentBody from '../CommentBody';
import Attachments from '../Attachments';

const Wrapper = styled.div`
  width: 100%;
  padding: 15px 15px 0;
  border-radius: 6px;
  background-color: #fff;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const EditInputStyled = styled(EditInput)`
  display: flex;
  width: 100%;
  padding: 10px 0;
  border-radius: 6px;
  background-color: #fff;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 10px;
  overflow: hidden;
  cursor: pointer;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
`;

const InfoWrapper = styled.div`
  margin-left: 10px;
`;

const Author = styled.p`
  font-size: 15px;
  font-weight: bold;
  white-space: nowrap;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const Created = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default function CommentCard({ comment, isOwner, loggedUserId, deleteComment, openPost }) {
  const {
    isEditOpen,
    isReplyOpen,
    openEdit,
    closeEdit,
    openReply,
    closeReply,
  } = useCommentInputState();

  if (!comment) {
    return null;
  }

  const onOpenPost = e => {
    if (e) {
      e.preventDefault();
    }

    openPost(comment.parents.post, comment.id);
  };

  function onDeleteClick() {
    deleteComment(comment).catch(err => {
      displayError(err);
    });
  }

  return (
    <Wrapper>
      <Header>
        <Avatar userId={comment.author.userId} useLink />
        <InfoWrapper>
          <Author>{comment.author.username}</Author>
          {/* TODO: commented on with link on content */}
          <Created>{dayjs(comment.meta.creationTime).fromNow()}</Created>
        </InfoWrapper>
        {isOwner && !comment.isDeleted ? (
          <DropDownActions onEditClick={openEdit} onDeleteClick={onDeleteClick} />
        ) : null}
      </Header>
      <Content onClick={onOpenPost}>
        <CommentBody comment={comment} />
        <Attachments comment={comment} />
      </Content>
      <ActionsPanel>
        <VotePanel entity={comment} />
        {loggedUserId && !comment.isDeleted ? (
          <Actions>
            <ActionButton name="comment__reply" onClick={openReply}>
              Reply
            </ActionButton>
          </Actions>
        ) : null}
      </ActionsPanel>
      {isReplyOpen ? <ReplyInput parentComment={comment} onClose={closeReply} /> : null}
      {isEditOpen ? <EditInputStyled comment={comment} onClose={closeEdit} /> : null}
    </Wrapper>
  );
}

CommentCard.propTypes = {
  comment: extendedCommentType.isRequired,
  isOwner: PropTypes.bool,
  loggedUserId: PropTypes.string,
  deleteComment: PropTypes.func.isRequired,
  openPost: PropTypes.func.isRequired,
};

CommentCard.defaultProps = {
  isOwner: false,
  loggedUserId: null,
};
