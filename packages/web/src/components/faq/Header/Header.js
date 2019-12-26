import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  width: 100%;
  padding-bottom: 30px;

  background-color: ${({ theme }) => theme.colors.blue};
  background-image: url('/images/pages/faq/header-background-mobile.svg');

  ${up.mobileLandscape} {
    background-image: url('/images/pages/faq/header-background.svg');
  }

  ${up.tablet} {
    padding-bottom: 0;
    border-radius: 50px;
  }

  ${up.desktop} {
    height: 411px;
  }
`;

const MobileNavigation = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
`;

const ButtonBack = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 42px;
`;

const BackIcon = styled(Icon).attrs({ name: 'arrow-back' })`
  width: 12px;
  height: 20px;
  color: #ffffff;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;

  ${up.tablet} {
    flex-direction: row;
    padding: 37px;
  }
`;

const Info = styled.div`
  flex: 1;
  text-align: center;

  ${up.tablet} {
    text-align: left;
  }
`;

const Title = styled.h1`
  margin: 20px 0 15px;
  line-height: 36px;
  font-weight: 600;
  font-size: 30px;
  color: #ffffff;

  ${up.tablet} {
    line-height: 54px;
    font-size: 44px;
    margin: 0 0 20px;
  }
`;

const Description = styled.p`
  line-height: 22px;
  font-size: 15px;
  color: #ffffff;

  ${up.tablet} {
    line-height: 28px;
    font-weight: 600;
    font-size: 18px;
  }
`;

const PictureImg = styled.img`
  width: 250px;
  height: 228px;

  ${up.tablet} {
    width: 324px;
    height: 310px;
    order: 2;
  }
`;

function Header({ isMobile, router }) {
  function onBack() {
    if (window.history.length === 0) {
      router.push('/');
      return;
    }

    router.back();
  }

  function mobileNavigation() {
    return (
      <MobileNavigation>
        <ButtonBack onClick={onBack}>
          <BackIcon />
        </ButtonBack>
        FAQ
      </MobileNavigation>
    );
  }

  return (
    <Wrapper>
      {isMobile ? mobileNavigation() : null}
      <Main>
        <PictureImg src="/images/pages/faq/header-picture.svg" />
        <Info>
          <Title>How does Commun work?</Title>

          <Description>
            Commun is built on autonomous communities that fully belong to users. Each community is
            self-regulated by a core scope of leaders, continuously electable by community members.
          </Description>
        </Info>
      </Main>
    </Wrapper>
  );
}

Header.propTypes = {
  router: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
};

Header.defaultProps = {
  isMobile: false,
};

export default withRouter(Header);
