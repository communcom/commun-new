import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

import { extendedPostType } from 'types/common';
import { ARTICLE_COVER_ASPECT_RATION } from 'shared/constants';
import { proxifyImageUrl } from 'utils/images/proxy';

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
`;

const TitleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::after {
    display: inline-block;
    content: '';
    height: 100%;
    vertical-align: middle;
  }
`;

const TitleBlock = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  width: 100%;
  padding: 15px 25px;
`;

const ArticleTitle = styled.span`
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.hoverBlack};

  ${is('hasImage')`
    color: #fff;
    text-shadow: 1px 0 4px rgba(0, 0, 0, 0.5);
  `};
`;

const CoverImg = styled.img`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Fader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.33);
`;

const ReadButton = styled(Button)`
  display: flex;
  align-items: center;
  margin-top: 14px;
  margin-bottom: -8px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  ${is('hasImage')`
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.2);
  `};
`;

const ReadButtonText = styled.span`
  margin-top: -2px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const ReadIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin: 0 6px 0 -4px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  border-radius: 50%;
`;

const ReadIcon = styled(Icon).attrs({ name: 'fire' })`
  width: 12px;
  height: 14px;
  color: ${({ theme }) => theme.colors.lightRed};
`;

export default function ArticleCardBody({ post, imageWidth, onPostClick }) {
  const { title, coverUrl } = post.document.attributes;
  const isCoverImage = Boolean(coverUrl);

  return (
    <Wrapper onClick={onPostClick}>
      <ArticleWrapper>
        <CoverContainer isShowImage={isCoverImage}>
          {coverUrl ? (
            <>
              <CoverImg src={proxifyImageUrl(coverUrl, { size: `${imageWidth}x0` })} />
              <Fader />
            </>
          ) : null}
        </CoverContainer>
        <TitleContainer>
          <TitleBlock>
            <ArticleTitle hasImage={isCoverImage}>{title}</ArticleTitle>
            <ReadButton hasImage={isCoverImage}>
              <ReadIconWrapper>
                <ReadIcon />
              </ReadIconWrapper>
              <ReadButtonText>Read</ReadButtonText>
            </ReadButton>
          </TitleBlock>
        </TitleContainer>
      </ArticleWrapper>
    </Wrapper>
  );
}

ArticleCardBody.propTypes = {
  post: extendedPostType.isRequired,
  imageWidth: PropTypes.number.isRequired,
  onPostClick: PropTypes.func.isRequired,
};
