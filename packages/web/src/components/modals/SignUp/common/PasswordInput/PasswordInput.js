import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { KEY_CODES } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { checkPressedKey } from 'utils/keyboard';

import { Input, InputWrapper } from '../../commonStyled';

const Wrapper = styled(InputWrapper)`
  width: 100%;
`;

const InputComponent = styled(Input)`
  padding: 17px 16px;
`;

const ShowWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 11px;
`;

const ShowButton = styled.button`
  padding: 5px;
`;

const EyeIcon = styled(Icon).attrs(({ isShowPassword }) => ({
  name: isShowPassword ? 'eye-no' : 'eye',
  width: 22,
  height: isShowPassword ? 15 : 14,
}))`
  cursor: pointer;
`;

export default function PasswordInput({
  password,
  error,
  onChange,
  onBlur,
  onEnterKeyDown,
  className,
}) {
  const { t } = useTranslation();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isInputWrapperFocused, setIsInputWrapperFocused] = useState(false);

  function onInputFocused() {
    setIsInputWrapperFocused(true);
  }

  function onInputBlured() {
    if (onBlur) {
      onBlur();
    }

    setIsInputWrapperFocused(false);
  }

  function onKeyDown(e) {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      onInputBlured();
      onEnterKeyDown();
    }
  }

  function onShowToggle(e) {
    e.preventDefault();

    setIsPasswordShow(!isPasswordShow);
  }

  return (
    <Wrapper focused={isInputWrapperFocused} error={error} className={className}>
      <InputComponent
        autoFocus
        type={isPasswordShow ? 'text' : 'password'}
        minLength={8}
        maxLength={52}
        placeholder={t('modals.sign_up.common.passwordInput.password')}
        value={password}
        error={error}
        className="js-CreatePasswordInput"
        onFocus={onInputFocused}
        onBlur={onInputBlured}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <ShowWrapper>
        <ShowButton onClick={onShowToggle}>
          <EyeIcon isShowPassword={isPasswordShow} />
        </ShowButton>
      </ShowWrapper>
    </Wrapper>
  );
}

PasswordInput.propTypes = {
  password: PropTypes.string,
  error: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onEnterKeyDown: PropTypes.func.isRequired,
};

PasswordInput.defaultProps = {
  password: '',
  error: '',
  onBlur: undefined,
};
