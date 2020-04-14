import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useTranslation } from 'shared/i18n';
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
  color: ${({ theme, isBlack }) => (isBlack ? theme.colors.black : theme.colors.white)};
  text-align: center;
`;

export default function Header({ isMobile, isBlack, close }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <CloseButtonStyled
        isWhiteBackground
        isBack={isMobile}
        isBlack={isBlack}
        onClick={() => close()}
      />
      <HeaderTitle isBlack={isBlack}>
        {t('modals.transfers.exchange_commun.common.header.buy')} Commun
      </HeaderTitle>
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
