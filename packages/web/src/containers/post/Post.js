import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import dayjs from 'dayjs';

import { styles, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import { ProfileLink, CommunityLink } from 'components/links';
import { withTranslation } from 'shared/i18n';
import { fetchPost } from 'store/actions/gate';
import { SHOW_MODAL_POST_EDIT } from 'store/constants';
import { postType, communityType, userType } from 'types/common';
import Avatar from 'components/common/Avatar';
import VotePanel from 'components/common/VotePanel';
import CommentsBlock from 'components/post/CommentsBlock';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';
import BodyRender from 'components/common/BodyRender';
import AttachmentsBlock from 'components/common/AttachmentsBlock';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';

const Wrapper = styled.main`
  width: 100%;
  min-width: calc(100vw - 40px);
  max-width: 900px;
  height: 100%;
  background-color: #fff;

  ${up.desktop} {
    min-width: auto;
    width: 900px;
  }

  ${is('isPage')`
    margin: 8px auto 40px;

    ${up.mobileLandscape} {
      margin: 8px auto 40px;
    }

    ${up.tablet} {
      margin: 0 auto 30px;
    }

    @media (min-width: 941px) {
      margin: 0 auto 30px;
    }

    ${up.desktop} {
      margin: 0 20px 30px;
      width: 900px;
    }

    @media (min-width: 1181px) {
      margin: 0 auto 30px;
    }
  `};

  img {
    max-width: 100%;
  }
`;

const ContentWrapper = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8px 16px 40px 16px;

  ${up.tablet} {
    padding: 40px 77px;
  }
`;

const Header = styled.header``;

const CommunityInfo = styled.div`
  width: 100%;
  padding: 8px 0;
  display: flex;

  ${up.tablet} {
    padding: 12px 0;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 16px;
`;

const CommunityName = styled.a`
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #000;
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
  margin-top: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

const PostInfo = styled.div`
  padding-right: 20px;
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
  color: #000;

  ${up.tablet} {
    font-size: 32px;
    line-height: 44px;
  }
`;

const QuantityInfo = styled.div`
  display: flex;
  padding: 12px 0;
`;

const ViewQuantity = styled.p`
  line-height: normal;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray};
`;

// const SharesQuantity = styled(ViewQuantity)`
//   margin-left: 24px;
// `;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const ActionsLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.15s;

  &:not(:first-child) {
    margin-left: 16px;
  }

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }

  ${is('active')`
    color: #fff;
    background: ${({ theme }) => theme.colors.blue} !important;
  `};
`;

const ActionsRight = styled(ActionsLeft)``;

const Body = styled.section`
  max-width: 100%;
  width: 100%;
  padding: 24px 0 16px;
  font-size: 15px;
  line-height: 24px;
  overflow: hidden;
  ${styles.breakWord};

  & * {
    max-width: 100%;
  }

  ${up.tablet} {
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

  ol {
    list-style: decimal;
  }

  ul {
    list-style: disc;
  }

  ol,
  ul {
    margin: 0 0.1em;
    padding-left: 1em;

    ol,
    ul {
      margin: 0.1em;
    }
  }

  p {
    position: relative;
    margin: 0;
    line-height: 1.5;
  }

  span {
    line-height: 1.5;
  }

  pre {
    overflow: hidden;
    white-space: pre-wrap;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};

    &:visited {
      color: #a0adf5;
    }
  }

  li p {
    display: inline;
    margin: 0;
  }

  .todoList {
    list-style: none;
    padding-left: 0;

    .todoList {
      padding-left: 1em;
    }
  }

  .todo {
    span:last-child:focus {
      outline: none;
    }
  }

  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.gray};
    margin: 0;
    padding-left: 10px;
    font-style: italic;
  }

  table {
    border-collapse: collapse;
  }

  tr {
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: bold;
  }

  th,
  td {
    padding: 5px 20px 5px 0;
  }

  b,
  strong {
    font-weight: 600;
  }
`;

const AvatarStyled = styled(Avatar)`
  width: 40px;
  height: 40px;

  ${up.desktop} {
    width: 56px;
    height: 56px;
  }
`;

const EmbedsWrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 10px;
  overflow: hidden;
`;

@withTranslation()
export default class Post extends Component {
  static propTypes = {
    post: postType.isRequired,
    community: communityType.isRequired,
    user: userType,
    isOwner: PropTypes.bool,
    isModal: PropTypes.bool,
    isOriginalContent: PropTypes.bool.isRequired,
    isAdultContent: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    recordPostView: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    report: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: null,
    isOwner: false,
    isModal: false,
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
    // eslint-disable-next-line no-console
    recordPostView(post.contentId).catch(err => console.warn(err));
  }

  clickShareButton = () => {};

  showEditPostModal = () => {
    const { openModal, post } = this.props;
    openModal(SHOW_MODAL_POST_EDIT, { contentId: post.contentId });
  };

  onReportClick = () => {
    const { post, report } = this.props;
    report(post.contentId);
  };

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
        <AttachmentsBlock attachments={attachments} />
      </EmbedsWrapper>
    );
  }

  renderPostInfo() {
    const { post, t } = this.props;

    return (
      <PostInfo>
        <QuantityInfo>
          <ViewQuantity>
            {t('post.commentsCount', { count: post.stats.commentsCount })}
          </ViewQuantity>
          {/* TODO: will be implemented after MVP */}
          {/* <SharesQuantity>{t('post.viewCount', { count: post.stats.viewCount })}</SharesQuantity> */}
        </QuantityInfo>
      </PostInfo>
    );
  }

  render() {
    const {
      post,
      community,
      user,
      isOwner,
      /*
      isOriginalContent,
      isAdultContent,
      */
      isModal,
      isMobile,
    } = this.props;

    if (!post) {
      return <div>Post is not found</div>;
    }

    return (
      <Wrapper isPage={!isModal}>
        <ContentWrapper>
          <Header>
            <CommunityInfo>
              <AvatarStyled communityId={community.id} useLink />
              <HeaderInfo>
                <CommunityLink community={community}>
                  <CommunityName>{community.name}</CommunityName>
                </CommunityLink>
                <TimeAndAuthor>
                  {dayjs(post.meta.creationTime).fromNow()}
                  {user ? (
                    <>
                      <Delimiter>•</Delimiter>
                      <ProfileLink user={user}>
                        <Author>{user.username}</Author>
                      </ProfileLink>
                    </>
                  ) : null}
                </TimeAndAuthor>
              </HeaderInfo>
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
          <Body>
            <BodyRender content={post.document} />
          </Body>
          {this.renderAttachments()}
          {isMobile ? this.renderPostInfo() : null}
          <PostActions>
            <ActionsLeft>
              <VotePanel entity={post} />
            </ActionsLeft>
            <ActionsRight>
              {!isMobile ? this.renderPostInfo() : null}
              <DropDownMenu
                align="right"
                handler={props => (
                  <ActiveButton
                    name="post__more-actions"
                    aria-label="открыть расширенное меню"
                    {...props}
                  >
                    <Icon name="more" size={24} />
                  </ActiveButton>
                )}
                items={() => (
                  <>
                    {isOwner ? (
                      <DropDownMenuItem name="post__edit" onClick={this.showEditPostModal}>
                        Edit
                      </DropDownMenuItem>
                    ) : (
                      <DropDownMenuItem name="post__report" onClick={this.onReportClick}>
                        Report
                      </DropDownMenuItem>
                    )}
                  </>
                )}
              />
              <ActiveButton
                name="post__share"
                aria-label="поделиться в соц сети"
                onClick={this.clickShareButton}
              >
                <Icon name="share" size={20} />
              </ActiveButton>
            </ActionsRight>
          </PostActions>
          <CommentsBlock contentId={post.contentId} />
        </ContentWrapper>
      </Wrapper>
    );
  }
}
