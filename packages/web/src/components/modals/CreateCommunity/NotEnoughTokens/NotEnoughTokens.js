import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { COMMUNITY_CREATION_TOKENS_NUMBER } from 'shared/constants';
import { useTranslation } from 'shared/i18n';

import { BigButton, ButtonsWrapper, Text, Title, Wrapper } from '../common.styled';

const TextStyled = styled(Text)`
  padding: 20px 0;
  line-height: 25px;

  .big {
    font-size: 18px;
  }
`;

function NotEnoughTokens({ close, openBuyCommunModal }) {
  const { t } = useTranslation();

  function onBuyCommun() {
    close(openBuyCommunModal());
  }

  return (
    <Wrapper>
      <Title>{t('modals.sign_up.title-oops')}</Title>
      <TextStyled
        dangerouslySetInnerHTML={{
          __html: t('modals.create_community.not_enough', { COMMUNITY_CREATION_TOKENS_NUMBER }),
        }}
      />
      <ButtonsWrapper>
        <BigButton type="button" onClick={onBuyCommun}>
          {t('header.buy_commun')}
        </BigButton>
        <BigButton type="button" isTransparent onClick={close}>
          {t('common.cancel')}
        </BigButton>
      </ButtonsWrapper>
    </Wrapper>
  );
}

NotEnoughTokens.propTypes = {
  close: PropTypes.func.isRequired,
  openBuyCommunModal: PropTypes.func.isRequired,
};

export default NotEnoughTokens;
