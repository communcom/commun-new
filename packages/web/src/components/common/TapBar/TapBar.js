import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { InvisibleText } from '@commun/ui';
import { FEATURE_WALLET, FEATURE_DISCOVER } from 'shared/featureFlags';

import TabBarLink from './TabBarLink';

const Wrapper = styled.nav`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 25;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
  box-shadow: 0px 6px 10px rgba(106, 128, 245, 0.35);
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
    width: 18,
    height: 20,
  },
  people: {
    name: 'people',
    width: 20,
    height: 18,
  },
  wallet: {
    name: 'wallet',
    width: 19,
    height: 20,
  },
  avatar: {
    name: 'avatar',
    width: 20,
    height: 20,
  },
};

export default function TapBar(props) {
  const { currentUser, featureFlags, openModalEditor, isShowTabBar } = props;

  if (!currentUser || !currentUser.username || !isShowTabBar) {
    return null;
  }

  const { username } = currentUser;
  const params = {
    username,
  };

  return (
    <Container>
      <Wrapper>
        <TabBarLink route="home" icon={icons.home} desc="Home" />
        {/* TODO: should be replaced with search when it will be implemented */}
        {featureFlags[FEATURE_DISCOVER] ? (
          <TabBarLink route="communities" icon={icons.people} desc="Discovery" />
        ) : null}
        <ButtonWrapper>
          <NewPostButton onClick={openModalEditor}>
            <PlusIcon />
            <InvisibleText>New Post</InvisibleText>
          </NewPostButton>
        </ButtonWrapper>
        {/* TODO: should be replaced with notifications when it will be implemented */}
        {featureFlags[FEATURE_WALLET] ? (
          <TabBarLink route="wallet" icon={icons.wallet} desc="Wallet" />
        ) : null}
        <TabBarLink
          route="profile"
          icon={icons.avatar}
          desc={`${username}'s profile`}
          params={params}
        />
      </Wrapper>
    </Container>
  );
}

TapBar.propTypes = {
  currentUser: PropTypes.shape({}),
  featureFlags: PropTypes.shape({}).isRequired,
  isShowTabBar: PropTypes.bool.isRequired,

  openModalEditor: PropTypes.func.isRequired,
};

TapBar.defaultProps = {
  currentUser: {},
};
