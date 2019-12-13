import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { extendedPostType } from 'types/common';
import { ARTICLE_COVER_ASPECT_RATION } from 'shared/constants';

const Wrapper = styled.div`
  padding: 0 15px;
  margin-top: 12px;
  cursor: pointer;
`;

const ArticleWrapper = styled.div`
  position: relative;
  padding-bottom: ${ARTICLE_COVER_ASPECT_RATION}%;
`;

const CoverContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  overflow: hidden;

  ${isNot('isShowImage')`
    background: ${({ theme }) => theme.colors.lightGrayBlue};
  `};

  &::after {
    display: inline-block;
    content: '';
    height: 100%;
    vertical-align: middle;
  }
`;

const TitleBlock = styled.div`
  display: inline-block;
  padding: 15px;
  text-align: center;
  line-height: 29px;
  font-size: 20px;
  font-weight: 600;
  vertical-align: middle;
`;

const CoverImg = styled.img`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function ArticleCardBody({ post, onPostClick }) {
  const { title, coverUrl } = post.document.attributes;

  return (
    <Wrapper onClick={onPostClick}>
      <ArticleWrapper>
        <CoverContainer isShowImage={Boolean(coverUrl)}>
          {coverUrl ? <CoverImg src={coverUrl} /> : null}
          <TitleBlock>{title}</TitleBlock>
        </CoverContainer>
      </ArticleWrapper>
    </Wrapper>
  );
}

ArticleCardBody.propTypes = {
  post: extendedPostType.isRequired,
  onPostClick: PropTypes.func.isRequired,
};
