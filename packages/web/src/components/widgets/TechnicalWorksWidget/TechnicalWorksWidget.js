import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Button, up } from '@commun/ui';
import { WidgetCard } from 'components/widgets/common';

const WidgetCardStyled = styled(WidgetCard)`
  margin: 20px 0;
  background-color: transparent;
  border-radius: 10px;
  overflow: hidden;

  ${up.mobileLandscape} {
    margin: 0 0 20px;
  }

  ${up.tablet} {
    width: 100%;
    padding: 0;
  }

  ${up.desktop} {
    width: 330px;

    ${is('isBig')`
      width: 100%;
    `};
  }
`;

const Cover = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 140px;
  padding: 12px 0 12px 15px;
  border-radius: 10px 10px 0 0;

  background-color: ${({ theme }) => theme.colors.blue};
  background-image: url('/images/gradient-background-mobile.png');
  background-size: cover;
  background-repeat: no-repeat;

  ${is('isBig')`
    justify-content: space-between;
    height: 202px;
    padding: 20px;

    background-image: url('/images/gradient-background-desktop.png');
    background-size: cover;
  `};
`;

const Title = styled.h4`
  min-width: 186px;
  max-width: 186px;
  font-size: 25px;
  line-height: 32px;
  color: #fff;
  font-weight: normal;

  @media (max-width: 350px) {
    min-width: 150px;
    max-width: 150px;
  }
`;

const BoldText = styled.span`
  font-weight: 700;
`;

const Text = styled.p`
  margin-right: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.gray};

  ${is('isBig')`
    max-width: 313px;
  `};
`;

const ButtonStyled = styled(Button)`
  flex-shrink: 0;
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

const Image = styled.img`
  position: absolute;
  top: 12px;
  right: -17px;
  width: 151px;

  ${is('isBig')`
    position: static;
    width: 216px;
  `};
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
`;

function TechnicalWorksWidget({ isBig }) {
  function reloadPage() {
    window.location.reload();
  }

  if (isBig) {
    return (
      <WidgetCardStyled noPadding isBig>
        <Cover isBig>
          <Title>
            Technical works <br />
            <BoldText>in progress</BoldText>
          </Title>
          <Image src="/images/widgets/technical-works.svg" alt="" isBig />
        </Cover>
        <Bottom>
          <Text isBig>
            Thank you for being patient. We are doing some work on the site and will be back shortly
          </Text>
          <ButtonStyled primary isBig onClick={reloadPage}>
            Refresh page
          </ButtonStyled>
        </Bottom>
      </WidgetCardStyled>
    );
  }

  return (
    <WidgetCardStyled noPadding>
      <Cover>
        <Title>
          Technical works <br />
          <BoldText>in progress</BoldText>
        </Title>
        <Image src="/images/widgets/technical-works.svg" alt="" />
      </Cover>
      <Bottom>
        <Text>
          We are doing some work on <br />
          the site and will be back shortly
        </Text>
        <ButtonStyled primary onClick={reloadPage}>
          Refresh
        </ButtonStyled>
      </Bottom>
    </WidgetCardStyled>
  );
}

TechnicalWorksWidget.propTypes = {
  isBig: PropTypes.bool,
};

TechnicalWorksWidget.defaultProps = {
  isBig: false,
};

export default TechnicalWorksWidget;
