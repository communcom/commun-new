import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';

import { communityType } from 'types';
import { CONTAINER_DESKTOP_PADDING, CONTAINER_PADDING, Button, up } from '@commun/ui';
import { HEADER_DESKTOP_HEIGHT, HEADER_HEIGHT } from 'components/common/Header';

import { SIDE_BAR_MARGIN } from 'shared/constants';

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

export default function SideBar({
  isMobile,
  isDesktop,
  featureFlags,
  myCommunities,
  manageCommunities,
  currentUser,
  fetchMyCommunitiesIfEmpty,
  fetchLeaderCommunitiesIfEmpty,
  openModalEditor,
}) {
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
        title="Management"
        link={{ route: 'leaderboard' }}
        items={manageCommunities.map(communityToListItem)}
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
        title="Communities"
        link={myCommunities.length > ITEMS_LIMIT ? linkParams : null}
        items={myCommunities.slice(0, ITEMS_LIMIT).map(communityToListItem)}
      />
    );
  };

  const renderContent = () => (
    <>
      <FeedItems currentUser={currentUser} featureFlags={featureFlags} />
      {currentUser ? (
        <NewButtonWrapper>
          <NewPostButton primary onClick={onNewPostClick}>
            New post
          </NewPostButton>
        </NewButtonWrapper>
      ) : null}
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
          isDesktop
            ? HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING
            : HEADER_HEIGHT + CONTAINER_PADDING
        }
      >
        <Wrapper>{renderContent()}</Wrapper>
      </Sticky>
    </DesktopWrapper>
  );
}

SideBar.propTypes = {
  currentUser: PropTypes.shape({}),
  isMobile: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  featureFlags: PropTypes.shape({}).isRequired,
  manageCommunities: PropTypes.arrayOf(communityType).isRequired,
  myCommunities: PropTypes.arrayOf(communityType).isRequired,
  fetchMyCommunitiesIfEmpty: PropTypes.func.isRequired,
  fetchLeaderCommunitiesIfEmpty: PropTypes.func.isRequired,
  openModalEditor: PropTypes.func.isRequired,
};

SideBar.defaultProps = {
  currentUser: null,
};
