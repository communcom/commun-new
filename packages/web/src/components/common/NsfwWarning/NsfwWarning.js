import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Button } from '@commun/ui';

import { useTranslation } from 'shared/i18n';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const EyeIcon = styled(Icon).attrs({ name: 'closed-eye', size: 28 })`
  color: #fff;
`;

const WarningTitle = styled.p`
  margin-top: 11px;
  line-height: 18px;
  font-size: 16px;
  font-weight: 600;
`;

const QuestionText = styled.span`
  margin-top: 4px;
  line-height: 18px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const AcceptButton = styled(Button).attrs({ primary: true })`
  display: block;
  width: 100%;
  margin-top: 20px;
`;

export default function NsfwWarning({ onAcceptClick }) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <IconWrapper>
        <EyeIcon />
      </IconWrapper>
      <WarningTitle>{t('components.nsfw_warning.title')}</WarningTitle>
      <QuestionText>{t('components.nsfw_warning.text')}</QuestionText>
      <AcceptButton onClick={onAcceptClick}>{t('common.show')}</AcceptButton>
    </Wrapper>
  );
}

NsfwWarning.propTypes = {
  onAcceptClick: PropTypes.func,
};

NsfwWarning.defaultProps = {
  onAcceptClick: undefined,
};
