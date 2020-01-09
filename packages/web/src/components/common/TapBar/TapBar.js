import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Icon } from '@commun/icons';
import { InvisibleText } from '@commun/ui';
import { FEATURE_WALLET, FEATURE_DISCOVER } from 'shared/featureFlags';

import TabBarLink from './TabBarLink';

const Wrapper = styled.nav`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  width: 100%;
  height: 55px;
  border-radius: 24px 24px 0 0;
  background-color: #fff;
  box-shadow: 0px -6px 16px rgba(56, 60, 71, 0.05);
`;

const Container = styled.div`
  width: 100%;
  height: 55px;
`;

const buttonStyles = css`
  flex-basis: 40px;
  flex-shrink: 0;
  flex-grow: 1;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  ${buttonStyles};
`;

const TabBarLinkStyled = styled(TabBarLink)`
  ${buttonStyles};
`;

const NewPostButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50px;
  box-shadow: 0 6px 10px rgba(106, 128, 245, 0.35);
`;

const PlusIcon = styled(Icon).attrs({
  name: 'cross',
})`
  width: 18px;
  height: 18px;
  transform: rotate(45deg);
`;

const icons = {
  home: {
    name: 'home',
    width: 22,
    height: 24,
  },
  people: {
    name: 'compass',
    width: 24,
    height: 24,
  },
  wallet: {
    name: 'wallet',
    width: 27,
    height: 28,
  },
  avatar: {
    name: 'avatar',
    width: 24,
    height: 24,
  },
};

export default function TapBar(props) {
  const { currentUser, featureFlags, openModalEditor, openLoginModal, isShowTabBar } = props;

  if (!isShowTabBar) {
    return null;
  }

  function onClickNewPost() {
    if (!currentUser) {
      openLoginModal();
      return;
    }

    openModalEditor();
  }

  function onClickWalletLink(e) {
    if (!currentUser) {
      e.preventDefault();

      openLoginModal();
    }
  }

  return (
    <Container>
      <Wrapper>
        <TabBarLinkStyled route="home" icon={icons.home} desc="Home" />
        {/* TODO: should be replaced with search when it will be implemented */}
        {featureFlags[FEATURE_DISCOVER] ? (
          <TabBarLinkStyled route="communities" icon={icons.people} desc="Discovery" />
        ) : null}
        <ButtonWrapper>
          <NewPostButton onClick={onClickNewPost}>
            <PlusIcon />
            <InvisibleText>New Post</InvisibleText>
          </NewPostButton>
        </ButtonWrapper>
        {/* TODO: should be replaced with notifications when it will be implemented */}
        {featureFlags[FEATURE_WALLET] ? (
          <>
            {currentUser ? (
              <TabBarLinkStyled
                route="wallet"
                icon={icons.wallet}
                desc="Wallet"
                onClick={onClickWalletLink}
              />
            ) : (
              <TabBarLinkStyled icon={icons.wallet} desc="Wallet" onClick={onClickWalletLink} />
            )}
          </>
        ) : null}
        {currentUser ? (
          <TabBarLinkStyled
            route="profile"
            icon={icons.avatar}
            desc={`${currentUser}'s profile`}
            params={{
              username: currentUser,
            }}
          />
        ) : (
          <TabBarLinkStyled icon={icons.avatar} desc="login" onClick={openLoginModal} />
        )}
      </Wrapper>
    </Container>
  );
}

TapBar.propTypes = {
  currentUser: PropTypes.string,
  featureFlags: PropTypes.shape({}).isRequired,
  isShowTabBar: PropTypes.bool.isRequired,

  openModalEditor: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
};

TapBar.defaultProps = {
  currentUser: null,
};
