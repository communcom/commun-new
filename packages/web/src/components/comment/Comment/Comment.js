import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { styles, up } from '@commun/ui';

import { extendedCommentType } from 'types';
import { displayError } from 'utils/toastsMessages';
import { hasDocumentText } from 'utils/editor';
import Avatar from 'components/common/Avatar';
import VotePanel from 'components/common/VotePanel';
import CommentsNested from 'components/post/CommentsNested';
import AsyncAction from 'components/common/AsyncAction';
import { ProfileLink } from 'components/links';

import { useCommentInputState } from '../hooks';
import EditInput from '../EditInput';
import ReplyInput from '../ReplyInput';
import DropDownActions from '../DropDownActions';
import CommentBody from '../CommentBody';
import Attachments from '../Attachments';
import { ActionButton } from '../common';

const wrapperStyles = css`
  display: flex;

  ${is('isNested')`
    margin-left: 20px;

    ${up.tablet} {
      margin-left: 40px;
    }
  `};
`;

const Wrapper = styled.article`
  ${wrapperStyles};
`;

const EditInputStyled = styled(EditInput)`
  ${wrapperStyles};
  margin-bottom: 20px;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 100%;
  padding-bottom: 10px;
  margin-left: 10px;
  overflow: hidden;
  ${styles.breakWord};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 34px;
  margin-left: 10px;
`;

const Created = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Content = styled.div`
  max-width: fit-content;
  font-size: 13px;
  line-height: 18px;
  border-radius: 12px;

  ${is('hasText')`
    min-height: 35px;
    padding: 8px 10px;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  ${up.desktop} {
    border-radius: 20px;
  }
`;

const AuthorLink = styled.a`
  margin-right: 5px;
  font-size: 13px;
  line-height: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const Delimiter = styled.span`
  padding: 0 5px;
  vertical-align: middle;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

const AvatarStyled = styled(Avatar)`
  width: 35px;
  height: 35px;
`;

export default function Comment({
  comment,
  isNested,
  loggedUserId,
  isOwner,
  isMobile,
  deleteComment,
}) {
  const {
    isEditOpen,
    isReplyOpen,
    openEdit,
    closeEdit,
    openReply,
    closeReply,
  } = useCommentInputState();

  function onDeleteClick() {
    deleteComment(comment).catch(err => {
      displayError(err);
    });
  }

  function renderReplyButton() {
    if (!loggedUserId || comment.isDeleted) {
      return null;
    }

    return (
      <>
        <Delimiter>•</Delimiter>
        <ActionButton name="comment__reply" inPost onClick={openReply}>
          Reply
        </ActionButton>
      </>
    );
  }

  function renderOwnerActions() {
    if (!isOwner || comment.isDeleted) {
      return null;
    }

    if (isMobile) {
      return (
        <>
          <Delimiter>•</Delimiter>
          <DropDownActions inPost onEditClick={openEdit} onDeleteClick={onDeleteClick} />
        </>
      );
    }

    return (
      <>
        <Delimiter>•</Delimiter>
        <ActionButton inPost name="comment__edit" onClick={openEdit}>
          Edit
        </ActionButton>
        <Delimiter>•</Delimiter>
        <AsyncAction onClickHandler={onDeleteClick}>
          <ActionButton inPost name="comment__delete">
            Delete
          </ActionButton>
        </AsyncAction>
      </>
    );
  }

  const { author } = comment;
  const commentAuthor = author.username || comment.contentId.userId;

  const hasText = hasDocumentText(comment.document);

  return (
    <>
      <Wrapper id={comment.id} isNested={isNested}>
        <AvatarStyled userId={author.userId} useLink />
        <Main>
          <Header />
          <Content hasText={hasText}>
            <ProfileLink user={author} allowEmpty>
              <AuthorLink>{commentAuthor}</AuthorLink>
            </ProfileLink>
            <CommentBody comment={comment} />
          </Content>
          <Attachments comment={comment} inPost isComment />
          <ActionsPanel>
            <VotePanel entity={comment} />
            <Actions>
              <Created title={dayjs(comment.meta.creationTime).format('LLL')}>
                {dayjs(comment.meta.creationTime).twitter()}
              </Created>
              {renderReplyButton()}
              {renderOwnerActions()}
            </Actions>
          </ActionsPanel>
          {isReplyOpen ? <ReplyInput parentComment={comment} onClose={closeReply} /> : null}
        </Main>
      </Wrapper>
      {isEditOpen ? <EditInputStyled comment={comment} onClose={closeEdit} /> : null}
      {!isNested ? <CommentsNested commentId={comment.id} key={comment.id} /> : null}
    </>
  );
}

Comment.propTypes = {
  comment: extendedCommentType.isRequired,
  isNested: PropTypes.bool,
  isOwner: PropTypes.bool,
  loggedUserId: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,
  deleteComment: PropTypes.func,
};

Comment.defaultProps = {
  isNested: false,
  isOwner: false,
  loggedUserId: null,
  deleteComment: null,
};
