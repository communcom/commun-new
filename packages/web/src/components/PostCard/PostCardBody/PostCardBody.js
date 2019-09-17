import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'shared/routes';

import { styles } from '@commun/ui';
import { SHOW_MODAL_POST } from 'store/constants';
import { postType } from 'types/common';
import Embed from 'components/Embed';

const Wrapper = styled.div`
  padding: 0 16px;
`;

const TitleLink = styled.a`
  display: block;
  color: #000;
  transition: color 0.15s;
`;

const Title = styled.h1`
  padding: 16px 0;
  line-height: 24px;
  font-size: 16px;
  letter-spacing: -0.41px;
`;

const Body = styled.div`
  ${styles.breakWord};
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.41px;

  & a {
    color: ${({ theme }) => theme.colors.contextBlue};

    &:visited {
      color: #a0adf5;
    }
  }
`;

const EmbedsWrapper = styled.div`
  margin-top: 10px;
`;

export default function PostCardBody({ post, openModal }) {
  function onClick(e) {
    e.preventDefault();
    openModal(SHOW_MODAL_POST, { contentId: post.contentId });
  }

  function renderEmbeds() {
    const { embeds } = post.content;

    if (!embeds || !embeds.length) {
      return null;
    }

    return (
      <EmbedsWrapper>
        {embeds
          .filter(embed => embed.result)
          .map(embed => (
            <Embed key={embed.id} data={embed.result} />
          ))}
      </EmbedsWrapper>
    );
  }

  return (
    <Wrapper>
      <Link route="post" params={post.contentId} passHref>
        <TitleLink onClick={onClick}>
          <Title>{post.content.title}</Title>
          <Body>{post.content.body.preview}</Body>
        </TitleLink>
      </Link>
      {renderEmbeds()}
    </Wrapper>
  );
}

PostCardBody.propTypes = {
  post: postType.isRequired,
  openModal: PropTypes.func.isRequired,
};
