import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';

import Shares from 'components/common/Shares';

const Wrapper = styled.div``;

const LinkBlock = styled.div`
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 15px;
  border: 1px solid #e2e6e8;
  border-radius: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.black};
  background: transparent;

  ${up.mobileLandscape} {
    margin-right: 15px;
  }
`;

const ButtonWrapper = styled.div`
  padding-top: 30px;

  & > button {
    width: 100%;
  }
`;

const ButtonStyled = styled(Button)`
  display: block;
  flex-grow: 1;
  height: 50px;
  font-size: 15px;

  ${up.mobileLandscape} {
    flex-grow: 0;
    min-width: unset;
    width: auto;
    height: 100%;
    padding: 0;
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 0;
  }
`;

export default function ShareBlock({ title = '', url, isMobile, className }) {
  const { t } = useTranslation();
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
      <ButtonStyled primary={isMobile} onClick={onShareClick}>
        {t('modals.share_block.share')}
      </ButtonStyled>
    );
  } else {
    button = (
      <ButtonStyled primary={isMobile} onClick={onCopyClick}>
        {t('modals.share_block.copy')}
      </ButtonStyled>
    );
  }

  return (
    <Wrapper className={className}>
      <LinkBlock>
        <InputWrapper>
          <Input value={url} readOnly ref={inputRef} />
          {isMobile ? null : button}
        </InputWrapper>
      </LinkBlock>
      <Shares title={title} url={url} />
      {isMobile ? <ButtonWrapper>{button}</ButtonWrapper> : null}
    </Wrapper>
  );
}

ShareBlock.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

ShareBlock.defaultProps = {
  title: '',
};
