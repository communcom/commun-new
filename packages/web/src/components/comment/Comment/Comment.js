/* stylelint-disable no-descending-specificity */

import React from 'react';
import PropTypes from 'prop-types';
import { injectFeatureToggles } from '@flopflip/react-redux';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { styles, up } from '@commun/ui';

import { extendedCommentType } from 'types';
import { FEATURE_DONATE_COUNT } from 'shared/featureFlags';
import { useTranslation } from 'shared/i18n';
import { hasDocumentText } from 'utils/editor';
import { displayError } from 'utils/toastsMessages';

import Avatar from 'components/common/Avatar';
import VotePanel from 'components/common/VotePanel';
import { ProfileLink } from 'components/links';
import CommentsNested from 'components/pages/post/CommentsNested';
import Attachments from '../Attachments';
import CommentBody from '../CommentBody';
import { ActionButton } from '../common';
import DropDownActions from '../DropDownActions';
import EditInput from '../EditInput';
import { useCommentInputState } from '../hooks';
import ReplyInput from '../ReplyInput';

const wrapperStyles = css`
  display: flex;

  ${is('isNested')`
    margin-left: 20px;

    ${up.tablet} {
      margin-left: 40px;
    }
  `};
`;

const DropDownActionsStyled = styled(DropDownActions)`
  ${isNot('inBottom')`
    visibility: hidden;
  `};
`;

const Wrapper = styled.article`
  ${wrapperStyles};
  margin-bottom: 17px;

  &:hover ${DropDownActionsStyled} {
    visibility: visible;
  }
`;

const EditInputStyled = styled(EditInput)`
  ${wrapperStyles};
  margin-bottom: 20px;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: calc(100% - 45px);
  margin-left: 10px;
  ${styles.breakWord};

  ${is('isDeleted')`
    justify-content: center;
  `};
`;

const CommentBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const JustifyBlock = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 34px;
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
  display: flex;
  flex-direction: column;
  max-width: fit-content;
  font-size: 13px;
  line-height: 18px;
  border-radius: 12px;

  ${is('hasText')`
    min-height: 35px;
    padding: 8px 10px;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};
`;

const UserLine = styled.div`
  display: flex;
  cursor: pointer;
`;

const AuthorLink = styled.a`
  margin-bottom: 7px;
  margin-right: 5px;
  font-size: 13px;
  line-height: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black};
`;

const RewardIcon = styled(Icon).attrs({ name: 'reward' })`
  cursor: pointer;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 17px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
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

function Comment({
  comment,
  displayReward,
  displayDonations,
  isNested,
  loggedUserId,
  isOwner,
  isMobile,
  deleteComment,
  openReportModal,
  openDonateModal,
  openDonationsModal,
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

  function onDeleteClick() {
    deleteComment(comment).catch(err => {
      displayError(err);
    });
  }

  function onReportClick() {
    openReportModal(comment.contentId);
  }

  function onDonateClick() {
    openDonateModal(comment.author, comment.contentId);
  }

  function onDonationsClick() {
    openDonationsModal({ contentId: comment.contentId, isComment: true });
  }

  function renderActions() {
    if (comment.isDeleted) {
      return null;
    }

    return (
      <>
        <Delimiter>•</Delimiter>
        <ActionButton name="comment__reply" inPost onClick={openReply}>
          {t('components.comment.reply')}
        </ActionButton>
        {!isOwner && featureToggles[FEATURE_DONATE_COUNT] ? (
          <>
            <Delimiter>•</Delimiter>
            <ActionButton name="comment__donate" inPost onClick={onDonateClick}>
              {t('components.comment.donate')}
            </ActionButton>
          </>
        ) : null}
      </>
    );
  }

  function renderDesktopActions() {
    if (!loggedUserId || comment.isDeleted) {
      return null;
    }

    if (isMobile) {
      return null;
    }

    return (
      <DropDownActionsStyled
        comment={comment}
        isOwner={isOwner}
        onEditClick={openEdit}
        onDeleteClick={onDeleteClick}
        onReportClick={onReportClick}
      />
    );
  }

  function renderMobileOwnerActions() {
    if (!isOwner || comment.isDeleted) {
      return null;
    }

    if (!isMobile) {
      return null;
    }

    return (
      <>
        <Delimiter>•</Delimiter>
        <DropDownActionsStyled
          comment={comment}
          isOwner={isOwner}
          inBottom
          onEditClick={openEdit}
          onDeleteClick={onDeleteClick}
          onReportClick={onReportClick}
        />
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
        <Main isDeleted={comment.isDeleted}>
          <JustifyBlock>
            <CommentBlock>
              <Content hasText={hasText}>
                <UserLine>
                  <ProfileLink user={author} allowEmpty>
                    <AuthorLink>{commentAuthor}</AuthorLink>
                  </ProfileLink>
                  {displayReward || displayDonations ? (
                    <RewardIcon onClick={onDonationsClick} />
                  ) : null}
                </UserLine>
                <CommentBody comment={comment} />
              </Content>
              <Attachments comment={comment} inPost isComment />
              {!comment.isDeleted ? (
                <ActionsPanel>
                  <VotePanel entity={comment} inComment />
                  <Actions>
                    <Created title={dayjs(comment.meta.creationTime).format('LLL')}>
                      {dayjs(comment.meta.creationTime).twitter()}
                    </Created>
                    {renderActions()}
                    {renderMobileOwnerActions()}
                  </Actions>
                </ActionsPanel>
              ) : null}
            </CommentBlock>
            <div>{renderDesktopActions()}</div>
          </JustifyBlock>
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
  displayReward: PropTypes.number,
  displayDonations: PropTypes.number,
  isNested: PropTypes.bool,
  isOwner: PropTypes.bool,
  loggedUserId: PropTypes.string,
  isMobile: PropTypes.bool.isRequired,

  deleteComment: PropTypes.func,
  openReportModal: PropTypes.func.isRequired,
  openDonateModal: PropTypes.func.isRequired,
  openDonationsModal: PropTypes.func.isRequired,
  featureToggles: PropTypes.object.isRequired,
};

Comment.defaultProps = {
  displayReward: undefined,
  displayDonations: undefined,
  isNested: false,
  isOwner: false,
  loggedUserId: null,
  deleteComment: null,
};

export default injectFeatureToggles([FEATURE_DONATE_COUNT])(Comment);
