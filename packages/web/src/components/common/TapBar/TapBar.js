import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Icon } from '@commun/icons';
import { animations, InvisibleText } from '@commun/ui';

import {
  FEATURE_DISCOVER,
  FEATURE_NOTIFICATIONS_BUTTON,
  FEATURE_SEARCH,
} from 'shared/featureFlags';

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
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px -6px 16px rgba(56, 60, 71, 0.05);
  animation: ${animations.popIn} 0.4s ease-out;
`;

const Container = styled.div`
  width: 100%;
  height: 55px;
  user-select: none;
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

const NewPostButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 50px;
  box-shadow: 0 6px 10px rgba(106, 128, 245, 0.35);

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
  }
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
  search: {
    name: 'search-thick',
    width: 23,
    height: 23,
  },
  notifications: {
    name: 'bell',
    width: 27,
    height: 28,
  },
  avatar: {
    name: 'avatar',
    width: 24,
    height: 24,
  },
};

export default function TapBar({
  currentUsername,
  featureFlags,
  openModalEditor,
  openLoginModal,
  isAutoLogging,
  isShowTapBar,
  isMaintenance,
}) {
  if (!isShowTapBar || (isAutoLogging && currentUsername)) {
    return null;
  }

  function onClickNewPost() {
    if (!currentUsername) {
      openLoginModal();
      return;
    }

    openModalEditor();
  }

  function onClickNotificationsLink(e) {
    if (!currentUsername) {
      e.preventDefault();

      openLoginModal();
    }
  }

  let discoveryButton = null;

  if (featureFlags[FEATURE_SEARCH]) {
    discoveryButton = <TabBarLinkStyled route="search" icon={icons.search} desc="Search" />;
  } else if (featureFlags[FEATURE_DISCOVER]) {
    discoveryButton = <TabBarLinkStyled route="communities" icon={icons.search} desc="Discovery" />;
  }

  return (
    <Container>
      <Wrapper>
        <TabBarLinkStyled route="home" icon={icons.home} desc="Home" />
        {discoveryButton}
        <ButtonWrapper>
          <NewPostButton disabled={isMaintenance} onClick={onClickNewPost}>
            <PlusIcon />
            <InvisibleText>New Post</InvisibleText>
          </NewPostButton>
        </ButtonWrapper>
        {featureFlags[FEATURE_NOTIFICATIONS_BUTTON] ? (
          <>
            {currentUsername ? (
              <TabBarLinkStyled
                route="notifications"
                icon={icons.notifications}
                desc="Notifications"
                onClick={onClickNotificationsLink}
              />
            ) : (
              <TabBarLinkStyled
                icon={icons.notifications}
                desc="Notifications"
                onClick={onClickNotificationsLink}
              />
            )}
          </>
        ) : null}
        {currentUsername ? (
          <TabBarLinkStyled
            route="profile"
            icon={icons.avatar}
            desc={`${currentUsername}'s profile`}
            params={{
              username: currentUsername,
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
  currentUsername: PropTypes.string,
  featureFlags: PropTypes.shape({}).isRequired,
  isAutoLogging: PropTypes.bool.isRequired,
  isShowTapBar: PropTypes.bool.isRequired,
  isMaintenance: PropTypes.bool,

  openModalEditor: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
};

TapBar.defaultProps = {
  currentUsername: null,
  isMaintenance: false,
};
