import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  position: relative;
  max-width: 100%;
  width: 100%;
  overflow: hidden;

  iframe {
    max-width: 100%;
    overflow: hidden;
  }

  &:not(:last-child) {
    padding-bottom: 10px;
  }
`;

const IframeWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 100%;
  width: 100%;
  min-height: min-content;

  div {
    min-width: 100%;
    width: 100%;
    min-height: min-content;
  }
`;

const CrossButton = styled.button`
  position: absolute;
  display: flex;

  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  top: 16px;
  right: 16px;

  border-radius: 24px;
  background: rgba(0, 0, 0, 0.4);
  color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
`;

const CrossIcon = styled(Icon).attrs({
  name: 'cross',
})`
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.background};
`;

export default function Frame({ data, onClose }) {
  const { id, attributes } = data;
  const { title, html } = attributes || {};

  const iframeWrapperRef = useRef(null);

  const didMount = () => {
    if (!title) {
      return;
    }

    const iframeWrapper = iframeWrapperRef.current;

    if (iframeWrapper) {
      const iframe = iframeWrapper.querySelector('iframe');
      if (iframe) {
        iframe.setAttribute('title', title);
      }
    }
  };

  useEffect(didMount, [title]);

  return (
    <Wrapper>
      {/* eslint-disable-next-line react/no-danger */}
      <IframeWrapper ref={iframeWrapperRef} dangerouslySetInnerHTML={{ __html: html }} />
      {onClose ? (
        <CrossButton onClick={() => onClose(id)}>
          <CrossIcon />
        </CrossButton>
      ) : null}
    </Wrapper>
  );
}

Frame.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    attributes: PropTypes.shape({
      title: PropTypes.string,
      html: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onClose: PropTypes.func,
};

Frame.defaultProps = {
  onClose: null,
};
