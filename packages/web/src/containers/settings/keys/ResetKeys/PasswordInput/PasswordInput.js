import React, { useState } from 'react';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Input } from '@commun/ui';

const ShowWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
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

const PasswordInput = props => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  function onShowToggle(e) {
    e.preventDefault();

    setIsPasswordShow(!isPasswordShow);
  }

  const postfix = (
    <ShowWrapper>
      <ShowButton onClick={onShowToggle}>
        <EyeIcon isShowPassword={isPasswordShow} />
      </ShowButton>
    </ShowWrapper>
  );

  return <Input type={isPasswordShow ? 'text' : 'password'} {...props} postfix={postfix} />;
};

export default PasswordInput;
