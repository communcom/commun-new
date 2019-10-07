import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SHOW_MODAL_POST } from 'store/constants';
import { extendedPostType } from 'types/common';
import BodyRender from 'components/BodyRender';
import PostCardAttachments from 'components/PostCardAttachments';

const Wrapper = styled.div`
  padding: 0 15px;
`;

const Content = styled.div`
  display: block;
  padding-top: 15px;
  color: #000;
  transition: color 0.15s;
`;

const Title = styled.h1`
  margin-bottom: 7px;
  line-height: 27px;
  font-size: 17px;
  letter-spacing: -0.41px;
`;

export default function PostCardBody({ post, openModal }) {
  function onClick(e) {
    e.preventDefault();
    openModal(SHOW_MODAL_POST, { contentId: post.contentId });
  }

  try {
    const { title } = post.content.attributes;
    const attachments = post.content.content.find(({ type }) => type === 'attachments');

    return (
      <Wrapper>
        <Content onClick={onClick}>
          {title ? <Title>{title}</Title> : null}
          <BodyRender content={post.content} />
        </Content>
        {attachments ? <PostCardAttachments attachments={attachments} onClick={onClick} /> : null}
      </Wrapper>
    );
  } catch (err) {
    return <Wrapper>Error: {err.message}</Wrapper>;
  }
}

PostCardBody.propTypes = {
  post: extendedPostType.isRequired,
  openModal: PropTypes.func.isRequired,
};
