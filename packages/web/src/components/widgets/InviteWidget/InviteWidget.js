import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from '@commun/ui';
import { WidgetCard } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  padding: 0;
  margin-bottom: 10px;
`;

const Img = styled.img`
  max-width: 100%;
  height: auto;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  padding: 19px 15px;
  height: 74px;
`;

const Text = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ButtonStyled = styled(Button)`
  min-width: 90px;
`;

const InviteWidget = ({ isAuthorized, refId, openOnboardingWelcome }) => {
  if (isAuthorized || !refId) {
    return null;
  }

  return (
    <WidgetCardStyled noPadding>
      <Img src="/images/widgets/invite.png" />

      <Info>
        <Text>Activate your account and start with first points</Text>
        <ButtonStyled primary onClick={openOnboardingWelcome}>
          Start
        </ButtonStyled>
      </Info>
    </WidgetCardStyled>
  );
};

InviteWidget.propTypes = {
  refId: PropTypes.string.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  openOnboardingWelcome: PropTypes.func.isRequired,
};

InviteWidget.defaultProps = {
  refId: undefined,
  isAuthorized: undefined,
};

export default InviteWidget;
