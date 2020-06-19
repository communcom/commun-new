import React from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';
import is from 'styled-is';

import { styles } from '@commun/ui';

import { extendedCommentType } from 'types';
import { FEATURE_DONATE_COUNT } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';
import { displayError } from 'utils/toastsMessages';

import Avatar from 'components/common/Avatar';
import DonationsBadge from 'components/common/DonationsBadge/DonationsBadge.connect';
import EntityCardReports from 'components/common/EntityCardReports';
import VotePanel from 'components/common/VotePanel';
import Attachments from '../Attachments';
import CommentBody from '../CommentBody';
import { ActionButton } from '../common';
import DropDownActions from '../DropDownActions';
import EditInput from '../EditInput';
import { useCommentInputState } from '../hooks';
import ReplyInput from '../ReplyInput';

const Wrapper = styled.div`
  width: 100%;
  padding: 15px 15px 0;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};

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
  background-color: ${({ theme }) => theme.colors.white};
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

const EmptySpace = styled.div`
  padding-bottom: 11px;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;

  ${is('isReport')`
    padding: 10px 15px;
  `};

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Created = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};

  ${styles.overflowEllipsis};
`;

function CommentCard({
  comment,
  isOwner,
  loggedUserId,
  deleteComment,
  openPost,
  openReportModal,
  isShowReports,
  featureToggles,
}) {
  const { t } = useTranslation();
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
            comment={comment}
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
      {comment.isDeleted ? (
        <EmptySpace />
      ) : (
        <>
          <ActionsPanel isReport={isShowReports}>
            <VotePanel entity={comment} inComment />
            {featureToggles[FEATURE_DONATE_COUNT] ? <DonationsBadge entityId={comment.id} /> : null}
            {!isShowReports ? (
              <Actions>
                <ActionButton name="comment__reply" onClick={openReply}>
                  {t('components.comment.reply')}
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

  featureToggles: PropTypes.object.isRequired,
};

CommentCard.defaultProps = {
  isOwner: false,
  isShowReports: false,
  loggedUserId: null,
};

export default injectFeatureToggles([FEATURE_DONATE_COUNT])(CommentCard);
