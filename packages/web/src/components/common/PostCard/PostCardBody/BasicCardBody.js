import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { extendedPostType } from 'types/common';

import AttachmentsBlock from 'components/common/AttachmentsBlock';
import BodyRender from 'components/common/BodyRender';
import NsfwContainer from 'components/common/NsfwContainer';

const NsfwContainerStyled = styled(NsfwContainer)`
  position: relative;
  padding: 0 15px 10px;
  cursor: pointer;
`;

const AttachmentsWrapper = styled.div`
  margin-top: 10px;

  ${is('isNsfw')`
    border-radius: 10px;
    overflow: hidden;
  `};
`;

const BlurWrapper = styled.div`
  ${is('isNsfw')`
    overflow: hidden;
    filter: blur(30px);
  `};
`;

const ContentLink = styled.a`
  display: block;
  padding-top: 10px;
  color: ${({ theme }) => theme.colors.black};

  ${is('isNsfw')`
    filter: blur(5px);
  `};
`;

const Title = styled.h1`
  margin: 20px 0 10px;
  font-weight: 600;
  font-size: 18px;
  line-height: 21px;
`;

const BodyRenderStyled = styled(BodyRender)`
  cursor: pointer;

  & p,
  & span {
    line-height: 1.5;
  }
`;

const AttachmentsBlockStyled = styled(AttachmentsBlock)``;

export default function BasicCardBody({ post, isNsfwAccepted, onPostClick, onNsfwAccepted }) {
  const selection = useRef();

  function onMouseUp() {
    selection.current = window.getSelection().toString().length > 0;
  }

  function handleClick(e) {
    if (!selection.current && e.target.tagName !== 'a') {
      onPostClick();
    }
  }

  function handleContentLinkClick(e) {
    e.preventDefault();
  }

  try {
    const { title } = post.document.attributes;
    const { content } = post.document;

    let hasContent = false;
    let attachments = null;

    for (const obj of content) {
      if (obj.type === 'attachments') {
        attachments = obj;
      } else {
        hasContent = true;
      }
    }

    const isNsfw = post.isNsfw && !isNsfwAccepted;

    return (
      <NsfwContainerStyled
        isNsfw={isNsfw}
        onAccept={onNsfwAccepted}
        onClick={handleClick}
        onMouseUp={onMouseUp}
      >
        {title ? (
          <ContentLink href={post.url} isNsfw={isNsfw} onClick={handleContentLinkClick}>
            <Title>{title}</Title>
          </ContentLink>
        ) : null}

        {hasContent ? (
          <ContentLink href={post.url} isNsfw={isNsfw} onClick={handleContentLinkClick}>
            <BodyRenderStyled
              content={post.document}
              textLength={post.textLength}
              cutLimits={{
                cutOn: 478,
                limit: 650,
              }}
              mobileCutLimits={{
                cutOn: 400,
                limit: 600,
              }}
            />
          </ContentLink>
        ) : null}
        {attachments ? (
          <AttachmentsWrapper isNsfw={isNsfw}>
            <BlurWrapper isNsfw={isNsfw}>
              <AttachmentsBlockStyled isCard attachments={attachments} />
            </BlurWrapper>
          </AttachmentsWrapper>
        ) : null}
      </NsfwContainerStyled>
    );
  } catch (err) {
    return <NsfwContainerStyled>Error: {err.message}</NsfwContainerStyled>;
  }
}

BasicCardBody.propTypes = {
  post: extendedPostType.isRequired,
  onPostClick: PropTypes.func.isRequired,
};
