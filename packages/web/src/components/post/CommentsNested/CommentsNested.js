import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedCommentType, postType } from 'types';
import CommentsList from 'components/post/CommentsList';

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

export default class CommentsNested extends Component {
  static propTypes = {
    comment: extendedCommentType.isRequired,
    post: postType.isRequired,
    fetchNestedComments: PropTypes.func.isRequired,
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
    const { comment } = this.props;

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
        <Action onClick={this.loadComments}>{text}</Action>
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
