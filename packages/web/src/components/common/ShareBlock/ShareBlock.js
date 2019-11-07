import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, Input } from '@commun/ui';
import Shares from 'components/common/Shares';

const Wrapper = styled.div``;

const LinkBlock = styled.div`
  display: flex;
  align-items: center;
`;

const InputStyled = styled(Input)`
  flex-grow: 1;
  margin-right: 15px;
`;

const ButtonStyled = styled(Button)`
  display: block;
  flex-grow: 1;
  height: 50px;
  font-size: 15px;
`;

export default function ShareBlock({ className, title = '', url }) {
  const inputRef = useRef(null);

  function onShareClick() {
    navigator.share({ title, url });
  }

  function onCopyClick() {
    const input = inputRef.current;

    input.focus();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('copy');
  }

  let button;

  if (process.browser && typeof navigator !== 'undefined' && navigator.share) {
    button = (
      <ButtonStyled primary onClick={onShareClick}>
        Share
      </ButtonStyled>
    );
  } else {
    button = (
      <ButtonStyled primary onClick={onCopyClick}>
        Copy
      </ButtonStyled>
    );
  }

  return (
    <Wrapper className={className}>
      <LinkBlock>
        <InputStyled title="Post link" value={url} readOnly ref={inputRef} />
        {button}
      </LinkBlock>
      <Shares title={title} url={url} />
    </Wrapper>
  );
}

ShareBlock.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
};

ShareBlock.defaultProps = {
  title: '',
};
