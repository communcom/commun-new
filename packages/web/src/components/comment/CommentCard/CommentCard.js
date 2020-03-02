import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { styles } from '@commun/ui';
import { extendedCommentType } from 'types';
import { displayError } from 'utils/toastsMessages';

import VotePanel from 'components/common/VotePanel';
import Avatar from 'components/common/Avatar';
import EntityCardReports from 'components/common/EntityCardReports';

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

  ${is('isReport')`
    padding: 0;
  `};

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

const Header = styled.header`
  display: flex;
  align-items: center;

  ${is('isReport')`
    padding: 15px 15px 0;
  `};
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 10px;
  overflow: hidden;
  cursor: pointer;

  ${is('isReport')`
    padding: 0 15px;
  `};
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const Author = styled.p`
  margin-bottom: 2px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 600;
  white-space: nowrap;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;

  ${is('isReport')`
    padding: 10px 15px;
  `};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const Created = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${styles.overflowEllipsis};
`;

export default function CommentCard({
  comment,
  isOwner,
  loggedUserId,
  deleteComment,
  openPost,
  openReportModal,
  isShowReports,
}) {
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

  function onReportClick() {
    openReportModal(comment.contentId);
  }

  return (
    <Wrapper isReport={isShowReports}>
      <Header isReport={isShowReports}>
        <Avatar userId={comment.author.userId} useLink />
        <InfoWrapper>
          <Author>{comment.author.username}</Author>
          {/* TODO: commented on with link on content */}
          <Created>{dayjs(comment.meta.creationTime).fromNow()}</Created>
        </InfoWrapper>
        {loggedUserId && !comment.isDeleted && !isShowReports ? (
          <DropDownActions
            isOwner={isOwner}
            onEditClick={openEdit}
            onDeleteClick={onDeleteClick}
            onReportClick={onReportClick}
          />
        ) : null}
      </Header>
      <Content isReport={isShowReports} onClick={onOpenPost}>
        <CommentBody comment={comment} />
        <Attachments comment={comment} />
      </Content>
      {comment.isDeleted ? null : (
        <>
          <ActionsPanel isReport={isShowReports}>
            <VotePanel entity={comment} />
            {!isShowReports ? (
              <Actions>
                <ActionButton name="comment__reply" onClick={openReply}>
                  Reply
                </ActionButton>
              </Actions>
            ) : null}
          </ActionsPanel>
          {!isShowReports && isReplyOpen ? (
            <ReplyInput parentComment={comment} onClose={closeReply} />
          ) : null}
          {!isShowReports && isEditOpen ? (
            <EditInputStyled comment={comment} onClose={closeEdit} />
          ) : null}
        </>
      )}
      {isShowReports ? <EntityCardReports entity={comment} /> : null}
    </Wrapper>
  );
}

CommentCard.propTypes = {
  comment: extendedCommentType.isRequired,
  isOwner: PropTypes.bool,
  isShowReports: PropTypes.bool,
  loggedUserId: PropTypes.string,

  deleteComment: PropTypes.func.isRequired,
  openPost: PropTypes.func.isRequired,
  openReportModal: PropTypes.func.isRequired,
};

CommentCard.defaultProps = {
  isOwner: false,
  isShowReports: false,
  loggedUserId: null,
};
