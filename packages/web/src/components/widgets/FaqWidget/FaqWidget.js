import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { withRouter } from 'next/router';

import { Button, up } from '@commun/ui';
import {
  WidgetCard,
  Cover,
  Info,
  Title,
  Description,
  Phone,
  Bottom,
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
  function onClick() {
    if (window.amplitude) {
      window.amplitude.getInstance().logEvent('openHC');
    }

    router.push('/faq');
  }

  if (isBig) {
    return (
      <WidgetCardStyled noPadding isBig>
        <Cover isBig>
          <Info isBig>
            <Title isBig>How to use Commun?</Title>
            <Description isBig>
              How to start posting and <br />
              monetize your activities
            </Description>
          </Info>
          <Phone src="/images/pages/faq/header-picture.svg" isBig />
        </Cover>
        <Bottom isBig>
          <Text isBig>
            Get rewarded for your posts, likes, and <br /> comments. Press “Start” to learn more
          </Text>
          <ButtonStyled primary isBig onClick={onClick}>
            Start
          </ButtonStyled>
        </Bottom>
      </WidgetCardStyled>
    );
  }

  return (
    <WidgetCardStyled noPadding>
      <Cover>
        <Info>
          <Title>How to use Commun?</Title>
          <Description>How to start posting and monetize your activities</Description>
        </Info>
        <Phone src="/images/widgets/faq.png" />
      </Cover>
      <Bottom>
        <Text>
          Get rewarded for your <br /> posts, likes, and comments
        </Text>
        <ButtonStyled primary onClick={onClick}>
          Start
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
