import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { CloseButtonStyled } from 'components/modals/transfers/common.styled';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  margin-bottom: 31px;
  padding: 20px 15px 0;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const ButtonList = styled.button.attrs({ type: 'button' })``;

const IconList = styled(Icon).attrs({
  name: 'list',
})`
  color: #fff;
`;

export default function Header({ id, isMobile, close }) {
  return (
    <Wrapper>
      <CloseButtonStyled isBack={isMobile} onClick={() => close()} />
      <HeaderTitle>Buy Commun</HeaderTitle>
      {id === 0 ? (
        <ButtonList>
          <IconList />
        </ButtonList>
      ) : null}
    </Wrapper>
  );
}

Header.propTypes = {
  id: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
