import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { up, InvisibleText } from '@commun/ui';
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

  ${up.tablet} {
    display: none;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 55px;

  ${up.tablet} {
    display: none;
  }
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

export default function TapBar(props) {
  const { currentUser, featureFlags, openEditor } = props;

  if (!currentUser || !currentUser.username) {
    return null;
  }

  const { username } = currentUser;
  const params = {
    username,
  };

  return (
    <Container>
      <Wrapper>
        <TabBarLink route="home" icon="home" desc="Home" />
        {/* TODO: should be replaced with search when it will be implemented */}
        {featureFlags[FEATURE_DISCOVER] ? (
          <TabBarLink route="communities" icon="discovery" desc="Discovery" />
        ) : null}
        <ButtonWrapper>
          <NewPostButton onClick={openEditor}>
            <PlusIcon />
            <InvisibleText>New Post</InvisibleText>
          </NewPostButton>
        </ButtonWrapper>
        {/* TODO: should be replaced with notifications when it will be implemented */}
        {featureFlags[FEATURE_WALLET] ? (
          <TabBarLink route="wallet" icon="wallet" desc="Wallet" />
        ) : null}
        <TabBarLink route="profile" icon="avatar" desc={`${username}'s profile`} params={params} />
      </Wrapper>
    </Container>
  );
}

TapBar.propTypes = {
  currentUser: PropTypes.shape({}),
  featureFlags: PropTypes.shape({}).isRequired,

  openEditor: PropTypes.func.isRequired,
};

TapBar.defaultProps = {
  currentUser: {},
};
