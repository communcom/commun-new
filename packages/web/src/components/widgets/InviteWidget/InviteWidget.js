import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';
import { WidgetCard } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 10px 10px 20px;
  background-color: transparent;
  border-radius: 10px;

  ${up.tablet} {
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
  }

  ${up.desktop} {
    width: 330px;
  }
`;

const Img = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
  background-color: ${({ theme }) => theme.colors.blue};
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19px 15px;
  height: 74px;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonStyled = styled(Button)`
  min-width: 64px;

  ${up.mobileLandscape} {
    min-width: 90px;
  }
`;

function InviteWidget({ isAuthorized, refId, isDesktop, openOnboardingWelcome }) {
  if (isAuthorized || !refId) {
    return null;
  }

  return (
    <WidgetCardStyled noPadding>
      <Img src={`/images/widgets/invite${isDesktop ? '' : '-mobile'}.png`} />

      <Info>
        <Text>Activate your account and start with first points</Text>
        <ButtonStyled primary onClick={openOnboardingWelcome}>
          Start
        </ButtonStyled>
      </Info>
    </WidgetCardStyled>
  );
}

InviteWidget.propTypes = {
  refId: PropTypes.string,
  isDesktop: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,

  openOnboardingWelcome: PropTypes.func.isRequired,
};

InviteWidget.defaultProps = {
  refId: undefined,
};

export default InviteWidget;
