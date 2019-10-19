import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { extendedPostType } from 'types/common';
import { SHOW_MODAL_POST } from 'store/constants';
import { withNamespaces } from 'shared/i18n';

import { PostLink } from 'components/links';
import VotePanel from 'components/common/VotePanel';

const Wrapper = styled.div`
  padding: 0 15px;
`;

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:not(:first-child) {
    margin-left: 24px;
  }
`;

const StatusLink = styled(StatusItem).attrs({ as: 'a' })`
  display: flex;
  color: ${({ theme }) => theme.colors.contextGrey};
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
  overflow: hidden;
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
  width: 19px;
  height: 18px;
  margin-right: 8px;
`;

const IconShare = styled(Icon).attrs({
  name: 'share',
})`
  cursor: pointer;
  width: 19px;
  height: 18px;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.contextGrey};
  transition: color 0.15s;

  &:not(:first-child) {
    margin-left: 20px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.hoverBlack};
  }
`;

@withNamespaces()
export default class PostCardFooter extends PureComponent {
  static propTypes = {
    post: extendedPostType.isRequired,
    isMobile: PropTypes.bool.isRequired,

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

  renderPostInfo() {
    const { post, t } = this.props;

    return (
      <CommentsWrapper>
        <StatusItem>{t('post.viewCount', { count: post.stats.viewCount })}</StatusItem>
        <PostLink post={post} hash="comments">
          <StatusLink>
            <IconComments /> {post.stats.commentsCount}
          </StatusLink>
        </PostLink>
      </CommentsWrapper>
    );
  }

  render() {
    const { post, isMobile } = this.props;

    return (
      <Wrapper>
        {isMobile ? <StatusLine>{this.renderPostInfo()}</StatusLine> : null}
        <ActionsLine>
          <ActionsLeft>
            <VotePanel entity={post} />
          </ActionsLeft>
          <ActionsRight>
            {!isMobile ? this.renderPostInfo() : null}
            <IconShare name="share" aria-label="Share" onClick={this.shareHandler} />
          </ActionsRight>
        </ActionsLine>
      </Wrapper>
    );
  }
}