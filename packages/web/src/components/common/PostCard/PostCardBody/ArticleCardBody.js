import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

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
  color: #fff;
  text-shadow: 1px 0 4px rgba(0, 0, 0, 0.5);
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
  background-color: #fff;
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.25);
`;

const ReadButtonText = styled.span`
  margin-top: -2px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
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

export default function ArticleCardBody({ post, onPostClick }) {
  const { title, coverUrl } = post.document.attributes;

  return (
    <Wrapper onClick={onPostClick}>
      <ArticleWrapper>
        <CoverContainer isShowImage={Boolean(coverUrl)}>
          {coverUrl ? (
            <>
              <CoverImg src={coverUrl} />
              <Fader />
            </>
          ) : null}
        </CoverContainer>
        <TitleContainer>
          <TitleBlock>
            <ArticleTitle>{title}</ArticleTitle>
            <ReadButton>
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
  onPostClick: PropTypes.func.isRequired,
};
