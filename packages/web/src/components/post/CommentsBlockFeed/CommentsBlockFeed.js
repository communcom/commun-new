import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Loader } from '@commun/ui';
import { Icon } from '@commun/icons';
import { contentIdType, extendedPostType } from 'types/common';
import { FEED_COMMENTS_FETCH_LIMIT, SORT_BY_POPULARITY } from 'shared/constants';
import { PostLink } from 'components/links';
import Avatar from 'components/common/Avatar';
import CommentForm from 'components/common/CommentForm';

import CommentsList from '../CommentList';

const Wrapper = styled.section`
  padding-top: 20px;

  ${is('inFeed')`
    padding: 0 15px 15px;
  `}
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
    isLoading: PropTypes.bool.isRequired,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    post: null,
  };

  async componentDidMount() {
    const { contentId, fetchPostComments } = this.props;

    try {
      await fetchPostComments({
        contentId,
        sortBy: SORT_BY_POPULARITY,
        limit: FEED_COMMENTS_FETCH_LIMIT,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
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
    const { order, orderNew, post, isLoading } = this.props;

    const commentsCount = post?.stats?.commentsCount;

    return (
      <Wrapper inFeed>
        <Body>
          <CommentsList order={order} isLoading={isLoading} inFeed />
          <CommentsList order={orderNew} isNew />
          {isLoading ? <LoaderStyled /> : null}
        </Body>
        {commentsCount > FEED_COMMENTS_FETCH_LIMIT ? (
          <PostLink post={post} hash="comments">
            <AllCommentsLink>Show all comments</AllCommentsLink>
          </PostLink>
        ) : null}
        {this.renderForm()}
      </Wrapper>
    );
  }
}
