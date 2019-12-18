import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

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

const Cover = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 130px;
  border-radius: 10px 10px 0 0;

  background: ${({ theme }) => theme.colors.blue};
  background: linear-gradient(120.28deg, ${({ theme }) => theme.colors.blue} 0.62%, #90a0f8 100%);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 130px 0 15px;
`;

const Title = styled.h4`
  font-weight: bold;
  font-size: 17px;
  line-height: 23px;
  color: #ffffff;
`;
const Description = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
  opacity: 0.7;
`;

const Phone = styled.img`
  position: absolute;
  right: 0;
  max-height: 100%;
  width: auto;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19px 15px;
  height: 74px;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
`;

const Text = styled.p`
  margin-right: 10px;
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

function FaqWidget({ router }) {
  function onClick() {
    if (window.amplitude) {
      window.amplitude.getInstance().logEvent('openHC');
    }

    router.push('/faq');
  }

  return (
    <WidgetCardStyled noPadding>
      <Cover>
        <Info>
          <Title>How to use Commun?</Title>
          <Description>What are Communities and Points</Description>
        </Info>
        <Phone src="/images/widgets/faq.png" />
      </Cover>
      <Bottom>
        <Text>Press start, and we’ll tell you about the social network of the future</Text>
        <ButtonStyled primary onClick={onClick}>
          Start
        </ButtonStyled>
      </Bottom>
    </WidgetCardStyled>
  );
}

FaqWidget.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(FaqWidget);
