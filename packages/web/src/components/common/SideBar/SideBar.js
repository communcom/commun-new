import React, { useEffect } from 'react';
import Sticky from 'react-stickynode';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button, CONTAINER_DESKTOP_PADDING, CONTAINER_PADDING, up } from '@commun/ui';

import { communityType } from 'types';
import { SIDE_BAR_MARGIN } from 'shared/constants';
import { withTranslation } from 'shared/i18n';

import { HEADER_DESKTOP_HEIGHT, HEADER_HEIGHT } from 'components/common/Header';
import FeedItems from './FeedItems';
import LinksList from './LinksList';

const ITEMS_LIMIT = 5;

const DesktopWrapper = styled.nav`
  width: 220px;
  margin-right: ${SIDE_BAR_MARGIN}px;
  flex-shrink: 0;
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const NewButtonWrapper = styled.div`
  display: flex;
  margin: 0 12px 20px;

  ${up.desktop} {
    margin: 0 0 20px;
  }
`;

const NewPostButton = styled(Button)`
  display: block;
  flex-grow: 1;
  height: 50px;
  font-weight: bold;
  font-size: 14px;
  line-height: 1;
`;

const SideBar = ({
  isMobile,
  featureFlags,
  myCommunities,
  manageCommunities,
  currentUser,
  fetchMyCommunitiesIfEmpty,
  fetchLeaderCommunitiesIfEmpty,
  openModalEditor,
  openOnboardingWelcome,
  openOnboardingRegistration,
  t,
}) => {
  useEffect(() => {
    if (currentUser) {
      fetchMyCommunitiesIfEmpty();
      fetchLeaderCommunitiesIfEmpty();
    }
  }, [currentUser, fetchMyCommunitiesIfEmpty, fetchLeaderCommunitiesIfEmpty]);

  const onNewPostClick = () => {
    openModalEditor();
  };

  const communityToListItem = community => {
    const itemParams = {
      route: 'community',
      params: {
        communityAlias: community.alias,
      },
      desc: community.name,
      avatar: {
        communityId: community.communityId,
      },
    };

    return itemParams;
  };

  const renderManagement = () => {
    if (!manageCommunities || !manageCommunities.length) {
      return null;
    }

    return (
      <LinksList
        title={t('sidebar.management')}
        link={{ route: 'leaderboard' }}
        items={manageCommunities.map(communityToListItem)}
        name="sidebar__management-items"
      />
    );
  };

  const renderMyCommunities = () => {
    if (!myCommunities || !myCommunities.length) {
      return null;
    }

    const linkParams = {
      route: 'communities',
      params: {
        section: 'my',
      },
    };

    return (
      <LinksList
        title={t('sidebar.communities')}
        link={myCommunities.length > ITEMS_LIMIT ? linkParams : null}
        items={myCommunities.slice(0, ITEMS_LIMIT).map(communityToListItem)}
        name="sidebar__communities-items"
      />
    );
  };

  const renderContent = () => (
    <>
      <FeedItems
        currentUser={currentUser}
        featureFlags={featureFlags}
        openOnboardingWelcome={openOnboardingWelcome}
        openOnboardingRegistration={openOnboardingRegistration}
      />
      <NewButtonWrapper>
        <NewPostButton primary onClick={onNewPostClick}>
          {t('sidebar.new_post')}
        </NewPostButton>
      </NewButtonWrapper>
      {renderManagement()}
      {renderMyCommunities()}
    </>
  );

  if (isMobile) {
    return null;
  }

  return (
    <DesktopWrapper>
      <Sticky
        top={
          isMobile
            ? HEADER_HEIGHT + CONTAINER_PADDING
            : HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING
        }
      >
        <Wrapper>{renderContent()}</Wrapper>
      </Sticky>
    </DesktopWrapper>
  );
};

SideBar.propTypes = {
  currentUser: PropTypes.shape({}),
  isMobile: PropTypes.bool.isRequired,
  featureFlags: PropTypes.shape({}).isRequired,
  manageCommunities: PropTypes.arrayOf(communityType).isRequired,
  myCommunities: PropTypes.arrayOf(communityType).isRequired,
  fetchMyCommunitiesIfEmpty: PropTypes.func.isRequired,
  fetchLeaderCommunitiesIfEmpty: PropTypes.func.isRequired,
  openModalEditor: PropTypes.func.isRequired,
  openOnboardingWelcome: PropTypes.func.isRequired,
  openOnboardingRegistration: PropTypes.func.isRequired,
};

SideBar.defaultProps = {
  currentUser: null,
};

export default withTranslation()(SideBar);
