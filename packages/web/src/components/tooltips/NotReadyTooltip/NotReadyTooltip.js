import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CloseButton } from '@commun/ui';
import { Icon } from '@commun/icons';
import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  position: absolute;
  top: calc(100% + 22px);
  right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  width: 298px;
  padding: 15px;
  background: ${({ theme }) => theme.colors.blue};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  color: #fff;
`;

const ClockIcon = styled(Icon).attrs({ name: 'clock' })`
  width: 20px;
  height: 20px;
`;

const InfoBlock = styled.div`
  padding: 0 10px;
`;

const TooltipTitle = styled.p`
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
`;

const TooltipDesc = styled.p`
  font-size: 12px;
  line-height: 16px;
`;

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  top: 15px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: color 0.15s, background-color 0.15s;

  & > svg {
    width: 12px;
    height: 12px;
  }

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

export default function NotReadyTooltip({ closeHandler, className }) {
  const { t } = useTranslation();

  return (
    <Wrapper className={className}>
      <ClockIcon />
      <InfoBlock>
        <TooltipTitle>{t('tooltips.not_ready.title')}</TooltipTitle>
        <TooltipDesc>{t('tooltips.not_ready.desc')}</TooltipDesc>
      </InfoBlock>
      <CloseButtonStyled onClick={closeHandler} />
    </Wrapper>
  );
}

NotReadyTooltip.propTypes = {
  closeHandler: PropTypes.func.isRequired,
};
