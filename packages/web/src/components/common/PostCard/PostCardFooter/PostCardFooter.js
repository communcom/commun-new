import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { isNil } from 'ramda';
import { injectFeatureToggles, ToggleFeature } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';
import { extendedPostType } from 'types/common';
import { SHOW_MODAL_POST, SHOW_MODAL_SHARE } from 'store/constants';
import { withTranslation } from 'shared/i18n';
import { FEATURE_DONATE_COUNT, FEATURE_POST_VIEW_COUNT } from 'shared/featureFlags';
import {
  POST_VOTE_PANEL_NAME,
  POST_COMMENTS_LINK_NAME,
  POST_SHARE_BUTTON_NAME,
  ONBOARDING_TOOLTIP_TYPE,
} from 'shared/constants';

import { PostLink } from 'components/links';
import VotePanel from 'components/common/VotePanel';
import DonationsBadge from 'components/common/DonationsBadge';

const Wrapper = styled.div`
  padding: 0 15px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:not(:first-child) {
    margin-left: 24px;
  }
`;

const StatusLink = styled(StatusItem).attrs({ as: 'a' })`
  display: flex;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }

  ${is('isFilled')`
    color: ${({ theme }) => theme.colors.blue}

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.colors.hoverBlue};
    }
  `};
`;

const CommentsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActionsLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 15px 0;
`;

const ActionsLeft = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const ActionsRight = styled(ActionsLeft)``;

const IconComments = styled(Icon).attrs(({ isFilled }) => ({
  name: isFilled ? 'chat-filled' : 'chat',
}))`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 6px;
  pointer-events: none;

  ${is('isFilled')`
    color: ${({ theme }) => theme.colors.blue}
  `};
`;

const IconView = styled(Icon).attrs({
  name: 'view',
})`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const IconShare = styled(Icon).attrs(({ isFilled }) => ({
  name: isFilled ? 'share-filled' : 'share',
}))`
  width: 24px;
  height: 24px;
  pointer-events: none;

  ${is('isFilled')`
    color: ${({ theme }) => theme.colors.blue}
  `};
`;

const Action = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0 5px 5px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:not(:first-child) {
    margin-left: 15px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }
`;

@injectFeatureToggles([FEATURE_DONATE_COUNT])
@withTranslation()
export default class PostCardFooter extends PureComponent {
  static propTypes = {
    post: extendedPostType.isRequired,
    tooltipType: PropTypes.string,

    featureToggles: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tooltipType: null,
  };

  shareHandler = e => {
    e.preventDefault();
    const { openModal, post } = this.props;
    openModal(SHOW_MODAL_SHARE, { post });
  };

  onCommentsClick = e => {
    e.preventDefault();
    const { post, openModal } = this.props;
    openModal(SHOW_MODAL_POST, { contentId: post.contentId, hash: 'comments' });
  };

  renderPostInfo() {
    const { post, tooltipType } = this.props;

    return (
      <CommentsWrapper role="group">
        {isNil(post.viewsCount) ? null : (
          <ToggleFeature flag={FEATURE_POST_VIEW_COUNT}>
            <StatusItem name="post-card__views-count">
              <IconView /> {post.viewsCount}
            </StatusItem>
          </ToggleFeature>
        )}
        <PostLink post={post} hash="comments">
          <StatusLink
            name={POST_COMMENTS_LINK_NAME}
            isFilled={tooltipType === ONBOARDING_TOOLTIP_TYPE.COMMENTS}
            onClick={this.onCommentsClick}
          >
            <IconComments isFilled={tooltipType === ONBOARDING_TOOLTIP_TYPE.COMMENTS} />{' '}
            {post.stats.commentsCount}
          </StatusLink>
        </PostLink>
      </CommentsWrapper>
    );
  }

  render() {
    const { post, tooltipType, featureToggles } = this.props;

    return (
      <Wrapper>
        <ActionsLine>
          <ActionsLeft name={POST_VOTE_PANEL_NAME}>
            <VotePanel
              entity={post}
              isFilled={tooltipType === ONBOARDING_TOOLTIP_TYPE.VOTE}
              inFeed
            />
            {featureToggles[FEATURE_DONATE_COUNT] ? <DonationsBadge entityId={post.id} /> : null}
          </ActionsLeft>
          <ActionsRight>
            {this.renderPostInfo()}
            <Action aria-label="Share" name={POST_SHARE_BUTTON_NAME} onClick={this.shareHandler}>
              <IconShare isFilled={tooltipType === ONBOARDING_TOOLTIP_TYPE.SHARE} name="share" />
            </Action>
          </ActionsRight>
        </ActionsLine>
      </Wrapper>
    );
  }
}
