import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Loader, up } from '@commun/ui';
import { Icon } from '@commun/icons';
import { contentIdType, extendedPostType } from 'types/common';
import { FEED_COMMENTS_FETCH_LIMIT } from 'shared/constants';
import { PostLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';

import Filter from '../CommentsBlock/Filter';
import CommentsList from '../CommentList';

const Wrapper = styled.section`
  padding-top: 20px;

  ${is('inFeed')`
    padding: 0 15px 15px;
  `}
`;

const Header = styled.div`
  padding: 16px 0;

  ${up.desktop} {
    padding: 0 0 12px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 35px 0;

  ${is('inFeed')`
    margin: 15px 0 0;
  `};
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 16px;
`;

const IconPhoto = styled(Icon).attrs({
  name: 'photo',
})`
  cursor: pointer;
  width: 19px;
  height: 19px;
  margin-left: 8px;
`;

const AllCommentsLink = styled.a`
  display: flex;
  margin-top: 10px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const LoaderStyled = styled(Loader)`
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default class CommentsBlockFeed extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    loggedUserId: PropTypes.string,
    post: extendedPostType,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    orderNew: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    post: null,
  };

  async componentDidMount() {
    const { contentId, filterSortBy: sortBy, fetchPostComments } = this.props;

    try {
      await fetchPostComments({
        contentId,
        sortBy,
        limit: FEED_COMMENTS_FETCH_LIMIT,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  componentDidUpdate(prevProps) {
    const { contentId, filterSortBy: sortBy, fetchPostComments } = this.props;

    if (prevProps.filterSortBy !== sortBy) {
      try {
        fetchPostComments({
          contentId,
          sortBy,
          limit: FEED_COMMENTS_FETCH_LIMIT,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  }

  renderForm() {
    const { loggedUserId, contentId } = this.props;

    if (!loggedUserId) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return (
      <InputWrapper inFeed>
        <Avatar userId={loggedUserId} useLink />
        <CommentFormStyled inPost parentPostId={contentId} />
        <IconPhoto />
      </InputWrapper>
    );
  }

  render() {
    const { order, orderNew, post, filterSortBy, isLoading, setCommentsFilter } = this.props;

    const commentsCount = post?.stats?.commentsCount;

    return (
      <Wrapper inFeed>
        {commentsCount ? (
          <Header>
            <HeaderTop>
              <Filter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
            </HeaderTop>
          </Header>
        ) : null}
        <Body>
          <CommentsList order={order} isLoading={isLoading} inFeed />
          <CommentsList order={orderNew} isNew />
          {isLoading ? <LoaderStyled /> : null}
        </Body>
        {commentsCount ? (
          <PostLink post={post} hash="comments">
            <AllCommentsLink>Show all comments</AllCommentsLink>
          </PostLink>
        ) : null}
        {this.renderForm()}
      </Wrapper>
    );
  }
}
