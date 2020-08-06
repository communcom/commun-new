import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import is from 'styled-is';

import { Button, up } from '@commun/ui';

import { useTranslation } from 'shared/i18n';
import { trackEvent } from 'utils/analytics';

import {
  Bottom,
  Cover,
  Description,
  Info,
  Phone,
  Title,
  WidgetCard,
} from 'components/widgets/common';

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

    ${is('isBig')`
      width: 100%;
    `};
  }
`;

const Text = styled.p`
  margin-right: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isBig')`
    font-size: 12px;
    line-height: 17px;
  `};
`;

const ButtonStyled = styled(Button)`
  min-width: 64px;

  ${up.mobileLandscape} {
    min-width: 90px;

    ${is('isBig')`
      @media(min-width: 1100px) {
        min-width: 100px;
      }
    `};
  }
`;

function FaqWidget({ router, isBig }) {
  const { t } = useTranslation();

  function onClick() {
    trackEvent('openHC');

    router.push('/faq');
  }

  if (isBig) {
    return (
      <WidgetCardStyled noPadding isBig>
        <Cover isBig>
          <Info isBig>
            <Title isBig>{t('widgets.faq.title')}</Title>
            <Description
              isBig
              dangerouslySetInnerHTML={{ __html: t('widgets.faq.big.description') }}
            />
          </Info>
          <Phone src="/images/pages/faq/header-picture.svg" isBig />
        </Cover>
        <Bottom isBig>
          <Text isBig dangerouslySetInnerHTML={{ __html: t('widgets.faq.big.text') }} />
          <ButtonStyled primary isBig onClick={onClick}>
            {t('widgets.faq.start')}
          </ButtonStyled>
        </Bottom>
      </WidgetCardStyled>
    );
  }

  return (
    <WidgetCardStyled role="banner" noPadding>
      <Cover>
        <Info>
          <Title>{t('widgets.faq.title')}</Title>
          <Description>{t('widgets.faq.description')}</Description>
        </Info>
        <Phone src="/images/widgets/faq.png" />
      </Cover>
      <Bottom>
        <Text dangerouslySetInnerHTML={{ __html: t('widgets.faq.text') }} />
        <ButtonStyled primary onClick={onClick}>
          {t('widgets.faq.start')}
        </ButtonStyled>
      </Bottom>
    </WidgetCardStyled>
  );
}

FaqWidget.propTypes = {
  isBig: PropTypes.bool,
  router: PropTypes.object.isRequired,
};

FaqWidget.defaultProps = {
  isBig: false,
};

export default withRouter(FaqWidget);
