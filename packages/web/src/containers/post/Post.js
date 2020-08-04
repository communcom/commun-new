import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToggleFeature } from '@flopflip/react-redux';
import dayjs from 'dayjs';
import Router from 'next/router';
import isNil from 'ramda/src/isNil';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { Button, InvisibleText, styles, up } from '@commun/ui';

import { extendedFullPostType } from 'types/common';
import { FEATURE_DONATE_COUNT, FEATURE_POST_VIEW_COUNT } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { fetchPost } from 'store/actions/gate';
import { SHOW_MODAL_POST_EDIT, SHOW_MODAL_SHARE } from 'store/constants';

import AttachmentsBlock from 'components/common/AttachmentsBlock';
import Avatar from 'components/common/Avatar';
import BodyRender from 'components/common/BodyRender';
import DonationsBadge from 'components/common/DonationsBadge';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import EmptyList from 'components/common/EmptyList';
import RewardsBadge from 'components/common/RewardsBadge';
import VotePanel from 'components/common/VotePanel';
import { CommunityLink, ProfileLink } from 'components/links';
import PostMeta from 'components/meta/PostMeta';
import CommentsBlock from 'components/pages/post/CommentsBlock';
import ExplorerTransactionMenuItem from 'components/pages/post/ExplorerTransactionMenuItem';

const Wrapper = styled.main`
  flex-grow: 1;
  width: 100%;
  min-width: calc(100vw - 40px);
  max-width: 900px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-anchor: none;

  ${up.tablet} {
    min-width: 670px;
    width: 670px;
    border-radius: 6px;
    overflow: hidden;
  }

  ${is('isPage')`
    margin: 0 auto 40px;

    ${up.tablet} {
      margin: 0 auto 30px;
    }
  `};

  ${is('isEmpty')`
    display: flex;
    align-items: center;
  `};

  img {
    max-width: 100%;
  }
`;

const ContentWrapper = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 0 16px 40px 16px;

  ${up.tablet} {
    padding: 0 20px 40px 20px;
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  min-height: 60px;
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 3px 20px rgba(56, 60, 71, 0.07);
  z-index: 12;

  ${up.tablet} {
    position: static;
    padding: 20px;
    box-shadow: unset;
  }
`;

const CommunityInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const HeaderInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 10px;
`;

const CommunityName = styled.a`
  display: block;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
`;

const Delimiter = styled.span`
  padding: 0 5px;
  vertical-align: middle;
  line-height: 16px;
`;

const Author = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const TimeAndAuthor = styled.p`
  margin-top: 3px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ActionsBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 10px;
  margin-left: auto;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const MoreActions = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const MoreActionsIcon = styled(Icon).attrs({ name: 'more' })`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray};
`;

/*
const Marks = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: normal;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
`;

const OriginalContentMark = styled.p``;

const AdultContentMark = styled.p``;

const MarksDot = styled.span`
  width: 4px;
  height: 4px;
  margin: 0 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray};
`;
 */

const PostTitle = styled.h1`
  font-size: 20px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.black};

  ${up.tablet} {
    font-size: 32px;
    line-height: 44px;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;

  ${up.tablet} {
    padding: 30px 0;
  }
`;

const ActionsLeft = styled.div`
  display: flex;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 15px;
  }
`;

const ActiveButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0 5px 5px;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;

  &:not(:first-child) {
    margin-left: 15px;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const ActionsRight = styled(ActionsLeft)``;

const Body = styled.section`
  max-width: 100%;
  width: 100%;
  padding: 15px 0 0;
  font-size: 15px;
  line-height: 24px;
  overflow: hidden;
  ${styles.breakWord};

  & * {
    max-width: 100%;
  }

  ${up.tablet} {
    padding: 0;
    font-size: 17px;
    line-height: 26px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
  }

  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.gray};
    margin: 0;
    padding-left: 10px;
    font-style: italic;
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 40px;
  height: 40px;

  ${is('isModal')`
    margin-left: 26px;

    ${up.tablet} {
      margin: 0;
    }
  `};

  ${up.desktop} {
    width: 56px;
    height: 56px;
  }
`;

const EmbedsWrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding-top: 20px;
  overflow: hidden;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
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

const IconComments = styled(Icon).attrs({
  name: 'chat',
})`
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const IconView = styled(Icon).attrs({
  name: 'view',
})`
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

const ButtonStyled = styled(Button)`
  max-height: 30px;

  @media (max-width: 450px) {
    display: none;
  }
`;

const FollowMenuItem = styled(DropDownMenuItem)`
  @media (min-width: 451px) {
    display: none;
  }
`;

const RewardsBadgeStyled = styled(RewardsBadge)`
  @media (max-width: 345px) {
    display: none;
  }
`;

@withTranslation()
export default class Post extends Component {
  static propTypes = {
    post: extendedFullPostType,
    commentId: PropTypes.string,
    router: PropTypes.object.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isLeader: PropTypes.bool.isRequired,
    isModal: PropTypes.bool,
    isOriginalContent: PropTypes.bool.isRequired,
    isAdultContent: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    featureFlags: PropTypes.object.isRequired,

    joinCommunity: PropTypes.func.isRequired,
    checkAuth: PropTypes.func.isRequired,
    recordPostView: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    openReportModal: PropTypes.func.isRequired,
    createBanPostProposalIfNeeded: PropTypes.func.isRequired,
    close: PropTypes.func,
  };

  static defaultProps = {
    post: null,
    commentId: null,
    isModal: false,
    close: null,
  };

  static async getInitialProps({ store, query, contentId, isServer, res }) {
    let params;

    if (query) {
      const { communityAlias, username, permlink } = query;

      // TODO: Надо разобраться с этими паразитными запросами как-то иначае...
      if (isServer && (permlink === '_stream_readable.js' || permlink === 'events.js')) {
        res.statusCode = 404;
        res.end('Not found');

        return {
          namespacesRequired: [],
        };
      }

      params = { communityAlias, username, permlink };
    } else {
      params = contentId;
    }

    let post = null;

    try {
      post = await store.dispatch(fetchPost(params));
    } catch (err) {
      return processErrorWhileGetInitialProps(err, res, []);
    }

    return {
      contentId: post.contentId,
      namespacesRequired: [],
    };
  }

  componentDidMount() {
    const { post, recordPostView } = this.props;

    if (post) {
      recordPostView(post.contentId).catch(err => {
        // eslint-disable-next-line no-console
        console.warn(err);
      });
    }
  }

  clickShareButton = e => {
    e.preventDefault();
    const { openModal, post } = this.props;
    openModal(SHOW_MODAL_SHARE, { post });
  };

  showEditPostModal = e => {
    e.preventDefault();
    const { openModal, post } = this.props;
    openModal(SHOW_MODAL_POST_EDIT, { contentId: post.contentId });
  };

  onReportClick = async () => {
    const { post, checkAuth, openReportModal } = this.props;

    try {
      await checkAuth({ allowLogin: true });
    } catch {
      return;
    }

    openReportModal(post.contentId);
  };

  onBanClick = () => {
    const { post, createBanPostProposalIfNeeded } = this.props;
    createBanPostProposalIfNeeded(post);
  };

  onDeleteClick = e => {
    const { post, deletePost, isModal, close } = this.props;

    e.preventDefault();
    deletePost(post);

    if (isModal && close) {
      close();
    } else {
      Router.replaceRoute('home');
    }
  };

  onSubscribeClick = async () => {
    const { post, joinCommunity, t } = this.props;
    const { community } = post;

    try {
      await joinCommunity(community.id);
      displaySuccess(t('toastsMessages.community.followed'));
    } catch (err) {
      displayError(err);
    }
  };

  renderHeader() {
    const {
      isOwner,
      isLeader,
      post /*
      isOriginalContent,
      isAdultContent,
      */,
      isModal,
      t,
    } = this.props;

    const { id, communityId, community, meta, author } = post;
    const isMyFeed = communityId === 'FEED';

    return (
      <Header>
        <CommunityInfo>
          {isMyFeed ? (
            <AvatarStyled userId={author.userId} useLink isModal={isModal} />
          ) : (
            <AvatarStyled communityId={communityId} useLink isModal={isModal} />
          )}
          <HeaderInfo>
            {isMyFeed ? (
              <ProfileLink user={author}>
                <CommunityName>{author.username}</CommunityName>
              </ProfileLink>
            ) : (
              <CommunityLink community={community}>
                <CommunityName>{community.name}</CommunityName>
              </CommunityLink>
            )}
            <TimeAndAuthor>
              <span title={dayjs(meta.creationTime).format('LLL')}>
                {dayjs(meta.creationTime).fromNow()}
              </span>
              {author || isMyFeed ? (
                <>
                  <Delimiter>•</Delimiter>
                  <ProfileLink user={author}>
                    <Author>{isMyFeed ? t('common.feed') : author.username}</Author>
                  </ProfileLink>
                </>
              ) : null}
            </TimeAndAuthor>
          </HeaderInfo>
          <ActionsBlock>
            <RewardsBadgeStyled postId={id} contentId={post.contentId} />
            {!community.isSubscribed ? (
              <ButtonStyled primary name="post__follow-community" onClick={this.onSubscribeClick}>
                {t('common.follow')}
              </ButtonStyled>
            ) : null}
            <DropDownMenu
              align="right"
              openAt="bottom"
              handler={props => (
                <MoreActions
                  name="post__more-actions"
                  aria-label={t('components.post.open_menu')}
                  {...props}
                >
                  <MoreActionsIcon />
                  <InvisibleText>{t('menu.common.more_actions')}</InvisibleText>
                </MoreActions>
              )}
              items={() => (
                <>
                  {isOwner ? (
                    <>
                      <DropDownMenuItem name="post__edit" onClick={this.showEditPostModal}>
                        {t('common.edit')}
                      </DropDownMenuItem>
                      <DropDownMenuItem name="post__delete-post" onClick={this.onDeleteClick}>
                        {t('common.delete')}
                      </DropDownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropDownMenuItem name="post__report" onClick={this.onReportClick}>
                        {t('menu.post.report')}
                      </DropDownMenuItem>
                      {!community.isSubscribed ? (
                        <FollowMenuItem
                          name="post__follow-community"
                          onClick={this.onSubscribeClick}
                        >
                          {t('common.follow')}
                        </FollowMenuItem>
                      ) : null}
                      {isLeader ? (
                        <DropDownMenuItem name="post__ban" onClick={this.onBanClick}>
                          {t('menu.post.propose_ban')}
                        </DropDownMenuItem>
                      ) : null}
                    </>
                  )}
                  <ExplorerTransactionMenuItem meta={meta} />
                </>
              )}
            />
          </ActionsBlock>
        </CommunityInfo>
        <div>
          {/* <Marks> */}
          {/*  {isOriginalContent && <OriginalContentMark>original content</OriginalContentMark>} */}
          {/*  {isOriginalContent && isAdultContent && <MarksDot />} */}
          {/*  {isAdultContent && <AdultContentMark>for adults</AdultContentMark>} */}
          {/* </Marks> */}
          <PostTitle>{post.document.title}</PostTitle>
        </div>
      </Header>
    );
  }

  renderAttachments() {
    const { post } = this.props;

    if (!post.document) {
      return null;
    }

    const attachments = post.document.content.find(({ type }) => type === 'attachments');

    if (!attachments) {
      return null;
    }

    return (
      <EmbedsWrapper>
        <AttachmentsBlock attachments={attachments} autoPlay />
      </EmbedsWrapper>
    );
  }

  renderPostInfo() {
    const { post, t } = this.props;
    const { viewsCount, stats } = post;

    return (
      <PostInfo>
        {isNil(viewsCount) ? null : (
          <ToggleFeature flag={FEATURE_POST_VIEW_COUNT}>
            <StatusItem name="post__views-count">
              <InvisibleText>
                {t('components.post.views_count', { count: viewsCount })}:
              </InvisibleText>
              <IconView /> {viewsCount}
            </StatusItem>
          </ToggleFeature>
        )}
        <StatusItem name="comments-count">
          <InvisibleText>
            {t('components.post.comments_count', { count: stats.commentsCount })}:
          </InvisibleText>
          <IconComments /> {stats.commentsCount}
        </StatusItem>
        <ActiveButton
          name="post__share"
          aria-label={t('components.post.aria_share_in_social')}
          onClick={this.clickShareButton}
        >
          <IconShare />
        </ActiveButton>
      </PostInfo>
    );
  }

  render() {
    const { post, commentId, router, isModal, t, featureFlags } = this.props;

    if (!post) {
      return (
        <Wrapper isEmpty>
          <EmptyList
            headerText={t('components.post.no_found')}
            subText={t('components.post.no_found_desc')}
          />
        </Wrapper>
      );
    }

    const hashInRoute = router.asPath.split('#')[1];

    return (
      <>
        <PostMeta post={post} />
        <Wrapper isPage={!isModal}>
          <ContentWrapper>
            {this.renderHeader()}
            <Content>
              <Body>
                <BodyRender content={post.document} />
              </Body>
              {this.renderAttachments()}
              <PostActions>
                <ActionsLeft>
                  <VotePanel entity={post} />
                  {featureFlags[FEATURE_DONATE_COUNT] ? (
                    <DonationsBadge entityId={post.id} />
                  ) : null}
                </ActionsLeft>
                <ActionsRight>{this.renderPostInfo()}</ActionsRight>
              </PostActions>
              <CommentsBlock contentId={post.contentId} commentId={commentId || hashInRoute} />
            </Content>
          </ContentWrapper>
        </Wrapper>
      </>
    );
  }
}
