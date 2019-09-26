import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { postType, communityType, userType } from 'types/common';

import CommentsBlockFeed from 'components/post/CommentsBlockFeed';
import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

const Wrapper = styled.article`
  margin-bottom: 10px;
  background-color: #fff;

  ${up('tablet')} {
    border-radius: 6px;
  }
`;

export default class PostCard extends PureComponent {
  static propTypes = {
    post: postType.isRequired,
    community: communityType.isRequired,
    user: userType,
  };

  static defaultProps = {
    user: null,
  };

  overTimeout = null;

  state = {
    showComments: false,
  };

  componentWillUnmount() {
    clearTimeout(this.overTimeout);
  }

  onMouseOver = () => {
    if (this.overTimeout) {
      return;
    }

    this.overTimeout = setTimeout(() => {
      this.setState({ showComments: true });
    }, 1000);
  };

  onMouseOut = () => {
    if (this.overTimeout) {
      clearTimeout(this.overTimeout);
      this.overTimeout = null;
    }
  };

  render() {
    const { user, post, community } = this.props;
    const { showComments } = this.state;

    return (
      <Wrapper
        onMouseOver={this.onMouseOver}
        onFocus={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onBlur={this.onMouseOut}
      >
        <PostCardHeader user={user} post={post} community={community} />
        <PostCardBody post={post} />
        <PostCardFooter post={post} />
        {showComments ? <CommentsBlockFeed contentId={post.contentId} inFeed /> : null}
      </Wrapper>
    );
  }
}
