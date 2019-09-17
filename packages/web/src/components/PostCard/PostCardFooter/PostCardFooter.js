import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { postType } from 'types/common';
import { SHOW_MODAL_POST } from 'store/constants';
import { Link } from 'shared/routes';
import { withNamespaces } from 'shared/i18n';

import VotePanel from 'components/VotePanel';
import CommentForm from 'components/CommentForm';

const Wrapper = styled.div`
  padding: 0 16px;
`;

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
`;

const UpvotesWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UpvoteIconWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.contextBlue};
`;

const UpvotesIcon = styled(Icon)`
  width: 8px;
  height: 8px;
`;

const StatusText = styled.span`
  display: inline-block;
  margin-left: 8px;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const StatusItem = styled.div`
  display: inline-block;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:not(:first-child) {
    margin-left: 24px;
  }
`;

const StatusLink = styled(StatusItem).attrs({ as: 'a' })`
  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }
`;

const CommentsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const ActionsLine = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 56px;
  padding: 10px 0;
  overflow: hidden;
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 12px;
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.contextGrey};
  background-color: ${({ theme }) => theme.colors.contextWhite};
  transition: background-color 0.15s;

  &:not(:first-child) {
    margin-left: 12px;
  }

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextLightGrey};
  }

  ${is('active')`
    color: #fff;
    background: ${({ theme }) => theme.colors.contextBlue} !important;
  `};
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;

  ${is('reverse')`
    transform: rotate(180deg);
  `};
`;

@withNamespaces()
export default class PostCardFooter extends PureComponent {
  static propTypes = {
    post: postType.isRequired,
    isUnsafeAuthorized: PropTypes.bool.isRequired,

    openModal: PropTypes.func.isRequired,
  };

  shareHandler = () => {
    // TODO: replace with real share handler
  };

  onCommentsClick = e => {
    const { post, openModal } = this.props;
    e.preventDefault();
    openModal(SHOW_MODAL_POST, { contentId: post.contentId, hash: 'comments' });
  };

  render() {
    const { post, isUnsafeAuthorized, t } = this.props;
    const { payout } = post;

    return (
      <Wrapper>
        <StatusLine>
          <UpvotesWrapper>
            <UpvoteIconWrapper>
              <UpvotesIcon name="short-arrow" />
            </UpvoteIconWrapper>
            <StatusText>{payout.rShares}</StatusText>
          </UpvotesWrapper>
          <CommentsWrapper>
            <Link route="post" params={post.contentId} hash="comments" passHref>
              <StatusLink>
                {t('post.commentsCount', { count: post.stats.commentsCount })}
              </StatusLink>
            </Link>
            <StatusItem>{t('post.viewCount', { count: post.stats.viewCount })}</StatusItem>
          </CommentsWrapper>
        </StatusLine>
        {isUnsafeAuthorized && (
          <ActionsLine>
            <VotePanel entity={post} noVotesNumber />
            <CommentFormStyled contentId={post.contentId} />
            <Action name="post-card__share" aria-label="Share" onClick={this.shareHandler}>
              <IconStyled name="share" />
            </Action>
          </ActionsLine>
        )}
      </Wrapper>
    );
  }
}
