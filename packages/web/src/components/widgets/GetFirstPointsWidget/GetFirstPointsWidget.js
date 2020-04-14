import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';

import { WidgetCard, Cover, Info, Title, Description, Phone } from 'components/widgets/common';

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

const InfoStyled = styled(Info)`
  padding: 20px 0 22px;
`;

const DescriptionStyled = styled(Description)`
  max-width: 153px;
  padding-top: 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0 0 10px 10px;
`;

const ButtonStyled = styled(Button)`
  width: 100%;
  max-width: 300px;
  height: auto;
  padding: 11px 30px;
  border-radius: 48px;
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
`;

export default function GetFirstPointsWidget({ openSignUpModal, className }) {
  const { t } = useTranslation();

  function onSignUpClick(e) {
    e.preventDefault();

    openSignUpModal();
  }

  return (
    <WidgetCardStyled noPadding className={className}>
      <Cover>
        <InfoStyled>
          <Title>{t('widgets.get_first_points.title')}</Title>
          <DescriptionStyled
            dangerouslySetInnerHTML={{ __html: t('widgets.get_first_points.description') }}
          />
        </InfoStyled>
        <Phone src="/images/widgets/faq.png" />
      </Cover>
      <Bottom>
        <ButtonStyled primary onClick={onSignUpClick}>
          {t('common.sign_up')}
        </ButtonStyled>
      </Bottom>
    </WidgetCardStyled>
  );
}

GetFirstPointsWidget.propTypes = {
  openSignUpModal: PropTypes.func.isRequired,
};
