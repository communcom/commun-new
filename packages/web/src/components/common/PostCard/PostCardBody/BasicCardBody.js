import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { extendedPostType } from 'types/common';
import BodyRender from 'components/common/BodyRender';
import AttachmentsBlock from 'components/common/AttachmentsBlock';

const Wrapper = styled.div`
  padding: 0 15px;
  cursor: pointer;
`;

const Content = styled.div`
  display: block;
  padding-top: 10px;
  color: #000;
  transition: color 0.15s;
`;

const Title = styled.h1`
  margin-bottom: 7px;
  line-height: 27px;
  font-size: 17px;
`;

const BodyRenderStyled = styled(BodyRender)`
  cursor: pointer;

  & p,
  & span {
    line-height: 1.5;
  }
`;

const AttachmentsBlockStyled = styled(AttachmentsBlock)`
  margin-top: 10px;
`;

export default function BasicCardBody({ post, onPostClick }) {
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

    return (
      <Wrapper onClick={onPostClick}>
        {hasContent ? (
          <Content>
            {title ? <Title>{title}</Title> : null}
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
          </Content>
        ) : null}
        {attachments ? <AttachmentsBlockStyled isCard attachments={attachments} /> : null}
      </Wrapper>
    );
  } catch (err) {
    return <Wrapper>Error: {err.message}</Wrapper>;
  }
}

BasicCardBody.propTypes = {
  post: extendedPostType.isRequired,
  onPostClick: PropTypes.func.isRequired,
};
