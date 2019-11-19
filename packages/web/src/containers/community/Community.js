/* eslint-disable no-underscore-dangle */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { up } from '@commun/ui';
import { communityType, tabInfoType } from 'types';
import { fetchCommunity } from 'store/actions/gate';
import withTabs from 'utils/hocs/withTabs';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';
import {
  FEATURE_COMMUNITY_MEMBERS,
  FEATURE_COMMUNITY_LEADERS,
  FEATURE_COMMUNITY_SETTINGS,
} from 'shared/featureFlags';
import { CommunityTab } from 'shared/constants';

import Redirect from 'components/common/Redirect';
import Footer from 'components/common/Footer';
import Content from 'components/common/Content';
import NavigationTabBar from 'components/common/NavigationTabBar';
import { CommunityHeader } from 'components/community';
import {
  GetPointsWidget,
  LeadersWidget,
  MembersWidget,
  TrendingCommunitiesWidget,
  ManageCommunityWidget,
  FriendsWidget,
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
    tabName: 'Posts',
    route: 'community',
    index: true,
    Component: CommunityFeed,
  },
  {
    id: CommunityTab.LEADERS,
    tabName: 'Leaders',
    route: 'community',
    Component: Leaders,
    featureName: FEATURE_COMMUNITY_LEADERS,
  },
  {
    id: CommunityTab.MEMBERS,
    tabName: 'Members',
    route: 'community',
    Component: Members,
    featureName: FEATURE_COMMUNITY_MEMBERS,
  },
  {
    id: CommunityTab.DESCRIPTION,
    tabName: 'Description',
    route: 'community',
    Component: Description,
  },
  {
    id: CommunityTab.RULES,
    tabName: 'Rules',
    route: 'community',
    Component: Rules,
  },
  {
    id: CommunityTab.SETTINGS,
    tabName: 'Settings',
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

@withRouter
@withTabs(TABS, 'feed')
export default class Community extends PureComponent {
  static propTypes = {
    communityId: PropTypes.string.isRequired,
    communityAlias: PropTypes.string.isRequired,
    community: communityType,
    subSection: PropTypes.string,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
    currentUserId: PropTypes.string,
    currentUserSubscriptions: PropTypes.arrayOf(PropTypes.string),
    isLeader: PropTypes.bool.isRequired,

    getUserSubscriptions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    community: null,
    tab: null,
    subSection: undefined,
    currentUserId: null,
    currentUserSubscriptions: [],
  };

  static async getInitialProps(params) {
    const props = await Community._getInitialProps(params);

    const updatedParams = {
      ...params,
      parentInitialProps: props,
    };

    await Promise.all([
      TrendingCommunitiesWidget.getInitialProps(updatedParams),
      MembersWidget.getInitialProps(updatedParams),
      LeadersWidget.getInitialProps(updatedParams),
    ]);

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

  async componentDidMount() {
    const { getUserSubscriptions, currentUserId } = this.props;

    if (currentUserId) {
      await getUserSubscriptions({
        userId: currentUserId,
      });
    }
  }

  async componentDidUpdate(prevProps) {
    const { getUserSubscriptions, currentUserId } = this.props;

    if (currentUserId && !prevProps.currentUserId && !prevProps.currentUserSubscriptions.length) {
      await getUserSubscriptions({
        userId: currentUserId,
      });
    }
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
    const { tabs, tab, community, isLeader, currentUserId, currentUserSubscriptions } = this.props;
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

    const tabId = tab ? tab.id : null;

    return (
      <Wrapper>
        <Header>
          <CommunityHeader community={community} />
          <NavigationTabBar
            tabs={tabs}
            params={{ communityAlias: community.alias }}
            isCommunity
            stats={stats}
          />
        </Header>
        <Content
          aside={() => (
            <>
              {isLeader ? <ManageCommunityWidget communityId={community.id} /> : null}
              <GetPointsWidget symbol={community.id} />
              <FriendsWidget />
              {tabId !== 'members' ? (
                <MembersWidget
                  communityId={community.id}
                  currentUserId={currentUserId}
                  currentUserSubscriptions={currentUserSubscriptions}
                />
              ) : null}
              {tabId !== 'leaders' ? (
                <LeadersWidget
                  communityId={community.id}
                  currentUserId={currentUserId}
                  currentUserSubscriptions={currentUserSubscriptions}
                />
              ) : null}
              <TrendingCommunitiesWidget />
              {/* <Advertisement advId={COMMUNITY_PAGE_ADV_ID} /> */}
              <Footer />
            </>
          )}
        >
          {this.renderContent()}
        </Content>
      </Wrapper>
    );
  }
}
