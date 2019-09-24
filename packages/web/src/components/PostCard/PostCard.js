import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { postType, communityType, userType } from 'types/common';

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

  render() {
    const { user, post, community } = this.props;

    return (
      <Wrapper>
        <PostCardHeader user={user} post={post} community={community} />
        <PostCardBody post={post} />
        <PostCardFooter post={post} />
      </Wrapper>
    );
  }
}
