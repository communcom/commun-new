import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PostLink } from 'components/links';
import CommentsList from 'components/post/CommentList/CommentList';
import { commentType } from 'types';

const Wrapper = styled.div`
  margin: 10px 0 15px 58px;
`;

const Action = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.contextBlue};
  cursor: pointer;
`;

const ActionLink = styled.a`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.contextBlue};
  cursor: pointer;
`;

export default class CommentsNested extends Component {
  static propTypes = {
    comment: commentType.isRequired,
    inFeed: PropTypes.bool,
    fetchNestedComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    inFeed: false,
  };

  loadComments = async () => {
    const { comment, fetchNestedComments } = this.props;

    await fetchNestedComments({
      contentId: comment.parents.post,
      parentComment: comment.contentId,
      offset: comment.children?.length,
    });
  };

  renderNeedMoreCount() {
    const { comment, inFeed } = this.props;

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
          <PostLink post={comment.parents.post} hash="comments">
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
        {comment.children?.length ? <CommentsList order={comment.children} isNested /> : null}
        {this.renderNeedMoreCount()}
        {comment.childrenNew?.length ? (
          <CommentsList order={comment.childrenNew} isNested isNew />
        ) : null}
      </>
    );
  }
}
