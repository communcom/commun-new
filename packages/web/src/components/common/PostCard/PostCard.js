import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';
import { extendedPostType } from 'types/common';
// import CommentsBlockFeed from 'components/post/CommentsBlockFeed';

import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';
import PostCardReports from './PostCardReports';

const Wrapper = styled.article`
  margin-bottom: 10px;
  background-color: #fff;

  ${up.tablet} {
    border-radius: 6px;
  }
`;

export default class PostCard extends PureComponent {
  static propTypes = {
    post: extendedPostType.isRequired,
    openPost: PropTypes.func.isRequired,
    openPostEdit: PropTypes.func.isRequired,
    isShowReports: PropTypes.bool,
  };

  static defaultProps = {
    isShowReports: false,
  };

  overTimeout = null;

  state = {
    // showComments: false,
  };

  componentWillUnmount() {
    clearTimeout(this.overTimeout);
  }

  onClick = e => {
    if (e) {
      e.preventDefault();
    }

    const { post, openPost } = this.props;
    openPost(post.contentId);
  };

  onEditClick = e => {
    if (e) {
      e.preventDefault();
    }

    const { post, openPostEdit } = this.props;
    openPostEdit(post.contentId);
  };

  // TODO: don't use now
  // onMouseOver = () => {
  //   if (this.overTimeout) {
  //     return;
  //   }
  //
  //   this.overTimeout = setTimeout(() => {
  //     this.setState({ showComments: true });
  //   }, 1000);
  // };
  //
  // onMouseOut = () => {
  //   if (this.overTimeout) {
  //     clearTimeout(this.overTimeout);
  //     this.overTimeout = null;
  //   }
  // };

  render() {
    const { post, isShowReports } = this.props;
    // const { showComments } = this.state;

    return (
      <Wrapper
      // onMouseOver={this.onMouseOver}
      // onFocus={this.onMouseOver}
      // onMouseOut={this.onMouseOut}
      // onBlur={this.onMouseOut}
      >
        <PostCardHeader post={post} onPostClick={this.onClick} onPostEditClick={this.onEditClick} />
        <PostCardBody post={post} onPostClick={this.onClick} />
        <PostCardFooter post={post} />
        {/* {!isShowReports && showComments ? <CommentsBlockFeed contentId={post.contentId} /> : null} */}
        {isShowReports ? <PostCardReports post={post} /> : null}
      </Wrapper>
    );
  }
}
