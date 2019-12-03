import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PostLink } from 'components/links';
import CommentsList from 'components/post/CommentsList';
import { extendedCommentType, postType } from 'types';

const Wrapper = styled.div`
  margin: 10px 0 15px 58px;
`;

const Action = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

const ActionLink = styled.a`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
`;

export default class CommentsNested extends Component {
  static propTypes = {
    comment: extendedCommentType.isRequired,
    post: postType.isRequired,
    inFeed: PropTypes.bool,
    fetchNestedComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    inFeed: false,
  };

  loadComments = async () => {
    const { comment, post, fetchNestedComments } = this.props;

    await fetchNestedComments({
      contentId: post.contentId,
      parentComment: comment.contentId,
      offset: comment.children?.length,
    });
  };

  renderNeedMoreCount() {
    const { comment, post, inFeed } = this.props;

    let needMoreCount = comment.childCommentsCount;

    if (comment.children) {
      if (comment.children.length < comment.childCommentsCount) {
        needMoreCount = comment.childCommentsCount - comment.children.length;
      } else {
        return null;
      }
    }

    const text = <>View {needMoreCount} more replies</>;

    return (
      <Wrapper isNested>
        {inFeed ? (
          <PostLink post={post} hash="comments">
            <ActionLink>{text}</ActionLink>
          </PostLink>
        ) : (
          <Action onClick={this.loadComments}>{text}</Action>
        )}
      </Wrapper>
    );
  }

  render() {
    const { comment } = this.props;

    return (
      <>
        {comment.children?.length ? <CommentsList order={comment.children} /> : null}
        {this.renderNeedMoreCount()}
        {comment.childrenNew?.length ? <CommentsList order={comment.childrenNew} /> : null}
      </>
    );
  }
}
