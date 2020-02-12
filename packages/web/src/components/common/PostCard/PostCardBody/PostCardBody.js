import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedPostType } from 'types/common';

import BasicCardBody from './BasicCardBody';
import ArticleCardBody from './ArticleCardBody.connect';

const Wrapper = styled.div`
  padding: 0 15px;
  cursor: pointer;
`;

const InvalidDocument = styled.div`
  margin-top: 10px;
`;

export default function PostCardBody({ post, isNsfwAccepted, onPostClick, onNsfwAccepted }) {
  if (!post.document || !post.document.attributes) {
    return (
      <Wrapper>
        <InvalidDocument>Invalid document format</InvalidDocument>
      </Wrapper>
    );
  }

  const { type } = post.document.attributes;

  if (type === 'article') {
    return <ArticleCardBody post={post} onPostClick={onPostClick} />;
  }

  return (
    <BasicCardBody
      post={post}
      onPostClick={onPostClick}
      isNsfwAccepted={isNsfwAccepted}
      onNsfwAccepted={onNsfwAccepted}
    />
  );
}

PostCardBody.propTypes = {
  post: extendedPostType.isRequired,
  isNsfwAccepted: PropTypes.bool.isRequired,

  onPostClick: PropTypes.func.isRequired,
  onNsfwAccepted: PropTypes.func.isRequired,
};
