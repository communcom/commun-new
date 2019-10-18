import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

export default class CommentsNested extends Component {
  static propTypes = {
    comment: commentType.isRequired,
    fetchNestedComments: PropTypes.func.isRequired,
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
    const { comment } = this.props;

    let needMoreCount = comment.childCommentsCount;

    if (comment.children) {
      if (comment.children.length < comment.childCommentsCount) {
        needMoreCount = comment.childCommentsCount - comment.children.length;
      } else {
        return null;
      }
    }

    return (
      <Wrapper isNested>
        <Action onClick={this.loadComments}>View {needMoreCount} more replies</Action>
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
