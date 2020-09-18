/* eslint-disable no-underscore-dangle */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { communityType, tabInfoType } from 'types';
import { CommunityTab } from 'shared/constants';
import {
  FEATURE_COMMUNITY_LEADERS,
  FEATURE_COMMUNITY_MEMBERS,
  FEATURE_COMMUNITY_SETTINGS,
} from 'shared/featureFlags';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import withTabs from 'utils/hocs/withTabs';
import { fetchCommunity } from 'store/actions/gate';

import Content from 'components/common/Content';
import Footer from 'components/common/Footer';
import NavigationTabBar from 'components/common/NavigationTabBar';
import Redirect from 'components/common/Redirect';
import CommunityMeta from 'components/meta/CommunityMeta';
import { CommunityHeader } from 'components/pages/community';
import {
  FriendsWidget,
  GetFirstPointsWidget,
  GetPointsWidget,
  LeadersWidget,
  ManageCommunityWidget,
  MembersWidget,
  TrendingCommunitiesWidget,
} from 'components/widgets';
// import Advertisement, { COMMUNITY_PAGE_ADV_ID } from 'components/common/Advertisement';

const CommunityFeed = dynamic(() => import('./CommunityFeed'));
const Description = dynamic(() => import('./Description'));
const Rules = dynamic(() => import('./Rules'));
const Members = dynamic(() => import('./Members'));
const Leaders = dynamic(() => import('./Leaders'));
const CommunitySettings = dynamic(() => import('./CommunitySettings'));

const TABS = [
  {
    id: CommunityTab.FEED,
    tabLocaleKey: 'posts',
    route: 'community',
    index: true,
    Component: CommunityFeed,
  },
  {
    id: CommunityTab.LEADERS,
    tabLocaleKey: 'leaders',
    route: 'community',
    Component: Leaders,
    featureName: FEATURE_COMMUNITY_LEADERS,
  },
  {
    id: CommunityTab.MEMBERS,
    tabLocaleKey: 'members',
    route: 'community',
    Component: Members,
    featureName: FEATURE_COMMUNITY_MEMBERS,
  },
  {
    id: CommunityTab.DESCRIPTION,
    tabLocaleKey: 'description',
    route: 'community',
    Component: Description,
  },
  {
    id: CommunityTab.RULES,
    tabLocaleKey: 'rules',
    route: 'community',
    Component: Rules,
  },
  {
    id: CommunityTab.SETTINGS,
    tabLocaleKey: 'settings',
    route: 'community',
    Component: CommunitySettings,
    featureName: FEATURE_COMMUNITY_SETTINGS,
  },
];

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Header = styled.div`
  margin-bottom: 8px;

  ${up.tablet} {
    margin-bottom: 20px;
  }
`;

const EmptyStub = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: #aaa;
`;

const PointsWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 0 15px;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 5;
`;

@withRouter
@withTabs(TABS, 'feed')
export default class Community extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string,
    communityAlias: PropTypes.string,
    community: communityType,
    subSection: PropTypes.string,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
    currentUserId: PropTypes.string,
    isLeader: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    communityId: undefined,
    communityAlias: undefined,
    community: null,
    tab: null,
    subSection: undefined,
    currentUserId: null,
  };

  static async getInitialProps(params) {
    const props = await Community._getInitialProps(params);

    const updatedParams = {
      ...params,
      parentInitialProps: props,
    };

    if (props.communityId) {
      await Promise.all([
        TrendingCommunitiesWidget.getInitialProps(updatedParams),
        MembersWidget.getInitialProps(updatedParams),
        LeadersWidget.getInitialProps(updatedParams),
      ]);
    }

    return props;
  }

  static async _getInitialProps({ query, store, res }) {
    let community = null;

    try {
      community = await store.dispatch(
        fetchCommunity({
          communityAlias: query.communityAlias,
        })
      );
    } catch (err) {
      return processErrorWhileGetInitialProps(err, res, []);
    }

    return {
      communityId: community.communityId,
      communityAlias: community.alias,
      subSection: query.subSection,
      namespacesRequired: [],
    };
  }

  renderMobileFirstPointsWidget() {
    const { tab, currentUserId, isDesktop } = this.props;

    if (tab?.id === CommunityTab.FEED && !currentUserId && !isDesktop) {
      return <GetFirstPointsWidget />;
    }

    return null;
  }

  renderWidgets() {
    const { community, currentUserId, isLeader, tab } = this.props;
    const tabId = tab ? tab.id : null;

    return (
      <>
        {isLeader ? (
          <ManageCommunityWidget communityId={community.id} communityAlias={community.alias} />
        ) : null}
        {currentUserId ? (
          <>
            <GetPointsWidget communityId={community.id} />
            {community.friendsCount ? <FriendsWidget communityId={community.id} /> : null}
          </>
        ) : (
          <GetFirstPointsWidget />
        )}
        {tabId !== CommunityTab.MEMBERS ? (
          <MembersWidget communityId={community.id} currentUserId={currentUserId} />
        ) : null}
        {tabId !== CommunityTab.LEADERS && community.leadersCount ? (
          <LeadersWidget communityId={community.id} currentUserId={currentUserId} />
        ) : null}
        <TrendingCommunitiesWidget />
      </>
    );
  }

  renderContent() {
    const {
      tab,
      tabProps,
      communityId,
      communityAlias,
      subSection,
      currentUserId,
      isLeader,
    } = this.props;

    if (!tab) {
      return <Redirect route="community" params={{ communityAlias }} isTab />;
    }

    return (
      <tab.Component
        {...tabProps}
        communityId={communityId}
        currentUserId={currentUserId}
        isLeader={isLeader}
        communityAlias={communityAlias}
        subSection={subSection}
      />
    );
  }

  render() {
    const { tabs, community, currentUserId, isDesktop } = this.props;
    let stats;

    if (!community) {
      return <EmptyStub>Community is not found</EmptyStub>;
    }

    if (community) {
      stats = {
        [CommunityTab.LEADERS]: community.leadersCount,
        [CommunityTab.MEMBERS]: community.subscribersCount,
      };
    }

    return (
      <>
        <CommunityMeta community={community} />
        <Wrapper>
          <Header>
            <CommunityHeader community={community} currentUserId={currentUserId} />
            {!isDesktop && currentUserId ? (
              <PointsWrapper>
                <GetPointsWidget communityId={community.id} />
              </PointsWrapper>
            ) : null}
            <NavigationTabBar
              tabs={tabs}
              tabsLocalePath="components.community.tabs"
              params={{ communityAlias: community.alias }}
              isCommunity
              stats={stats}
            />
          </Header>
          <Content
            aside={() => (
              <>
                {this.renderWidgets()}
                {/* <Advertisement advId={COMMUNITY_PAGE_ADV_ID} /> */}
                <Footer />
              </>
            )}
          >
            {this.renderMobileFirstPointsWidget()}
            {this.renderContent()}
          </Content>
        </Wrapper>
      </>
    );
  }
}
