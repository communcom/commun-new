import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';
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
  background-color: ${({ theme }) => theme.colors.white};
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

export default function InviteWidget({ isAuthorized, refId, isDesktop, openOnboardingWelcome }) {
  const { t } = useTranslation();

  if (isAuthorized || !refId) {
    return null;
  }

  return (
    <WidgetCardStyled noPadding>
      <Img src={`/images/widgets/invite${isDesktop ? '' : '-mobile'}.png`} />
      <Info>
        <Text>{t('widgets.invite.text')}</Text>
        <ButtonStyled primary onClick={openOnboardingWelcome}>
          {t('widgets.invite.start')}
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
