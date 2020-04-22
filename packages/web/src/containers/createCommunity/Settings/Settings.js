import React from 'react';
import styled from 'styled-components';

import { Card, ButtonWithTooltip, up } from '@commun/ui';
import { useTranslation } from 'shared/i18n';

import NotReadyTooltip from 'components/tooltips/NotReadyTooltip';

const Wrapper = styled(Card)`
  padding: 15px 15px;

  ${up.desktop} {
    padding-top: 20px;
  }
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 5px;
  white-space: pre-wrap;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default function Settings() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <ButtonsWrapper>
        <ButtonWithTooltip
          tooltip={closeHandler => <NotReadyTooltip closeHandler={closeHandler} />}
        >
          {t('common.edit')}
        </ButtonWithTooltip>
      </ButtonsWrapper>
      <Content>{t('components.createCommunity.default_settings')}</Content>
    </Wrapper>
  );
}
