import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ToggleFeature } from '@flopflip/react-redux';

import { Icon } from '@commun/icons';
import { extendedPostType } from 'types/common';
import { SHOW_MODAL_POST, SHOW_MODAL_SHARE } from 'store/constants';
import { withTranslation } from 'shared/i18n';
import { FEATURE_POST_VIEW_COUNT } from 'shared/featureFlags';

import { PostLink } from 'components/links';
import VotePanel from 'components/common/VotePanel';

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
`;

const ActionsRight = styled(ActionsLeft)``;

const IconComments = styled(Icon).attrs({
  name: 'chat',
})`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const IconView = styled(Icon).attrs({
  name: 'view',
})`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const IconShare = styled(Icon).attrs({
  name: 'share',
})`
  width: 24px;
  height: 24px;
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

@withTranslation()
export default class PostCardFooter extends PureComponent {
  static propTypes = {
    post: extendedPostType.isRequired,

    openModal: PropTypes.func.isRequired,
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
    const { post /* ,t */ } = this.props;

    return (
      <CommentsWrapper>
        <ToggleFeature flag={FEATURE_POST_VIEW_COUNT}>
          <StatusItem>
            <IconView /> {post.viewsCount}
          </StatusItem>
        </ToggleFeature>
        <PostLink post={post} hash="comments">
          <StatusLink>
            <IconComments /> {post.stats.commentsCount}
          </StatusLink>
        </PostLink>
      </CommentsWrapper>
    );
  }

  render() {
    const { post } = this.props;

    return (
      <Wrapper>
        <ActionsLine>
          <ActionsLeft>
            <VotePanel entity={post} />
          </ActionsLeft>
          <ActionsRight>
            {this.renderPostInfo()}
            <Action aria-label="Share" onClick={this.shareHandler}>
              <IconShare name="share" />
            </Action>
          </ActionsRight>
        </ActionsLine>
      </Wrapper>
    );
  }
}
