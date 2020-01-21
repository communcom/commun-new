import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CloseButtonStyled } from 'components/modals/transfers/common.styled';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  padding: 20px 15px 15px;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  font-size: 15px;
  font-weight: 600;
  line-height: 30px;
  color: ${({ theme, isBlack }) => (isBlack ? theme.colors.black : '#fff')};
  text-align: center;
`;

export default function Header({ isMobile, isBlack, close }) {
  return (
    <Wrapper>
      <CloseButtonStyled
        isWhiteBackground
        isBack={isMobile}
        isBlack={isBlack}
        onClick={() => close()}
      />
      <HeaderTitle isBlack={isBlack}>Buy Commun</HeaderTitle>
    </Wrapper>
  );
}

Header.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isBlack: PropTypes.bool,
  close: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isBlack: false,
};
