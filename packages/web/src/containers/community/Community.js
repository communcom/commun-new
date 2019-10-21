/* eslint-disable no-underscore-dangle */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { up } from '@commun/ui';
import { communityType, tabInfoType } from 'types';
import Redirect from 'components/common/Redirect';
import Footer from 'components/common/Footer';
import Content from 'components/common/Content';
import NavigationTabBar from 'components/common/NavigationTabBar';
import { CommunityHeader } from 'components/community';
import { LeadersWidget, MembersWidget, TrendingCommunitiesWidget } from 'components/widgets';
// import Advertisement, { COMMUNITY_PAGE_ADV_ID } from 'components/common/Advertisement';
import withTabs from 'utils/hocs/withTabs';
import {
  FEATURE_COMMUNITY_MEMBERS,
  FEATURE_COMMUNITY_LEADERS,
  FEATURE_COMMUNITY_SETTINGS,
} from 'shared/featureFlags';
import { fetchCommunity } from 'store/actions/gate';
import { processErrorWhileGetInitialProps } from 'utils/errorHandling';

const CommunityFeed = dynamic(() => import('./CommunityFeed'));
const Description = dynamic(() => import('./Description'));
const Rules = dynamic(() => import('./Rules'));
const Members = dynamic(() => import('./Members'));
const Leaders = dynamic(() => import('./Leaders'));
const CommunitySettings = dynamic(() => import('./CommunitySettings'));

const TABS = [
  {
    id: 'feed',
    tabName: 'Feed',
    route: 'community',
    index: true,
    Component: CommunityFeed,
  },
  {
    id: 'info',
    tabName: 'Description',
    route: 'community',
    Component: Description,
  },
  {
    id: 'rules',
    tabName: 'Rules',
    route: 'community',
    Component: Rules,
  },
  {
    id: 'leaders',
    tabName: 'Leaders',
    route: 'community',
    Component: Leaders,
    featureName: FEATURE_COMMUNITY_LEADERS,
  },
  {
    id: 'members',
    tabName: 'Members',
    route: 'community',
    Component: Members,
    featureName: FEATURE_COMMUNITY_MEMBERS,
  },
  {
    id: 'settings',
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
  };

  static defaultProps = {
    community: null,
    tab: null,
    subSection: undefined,
  };

  static async getInitialProps(params) {
    const [props] = await Promise.all([
      Community._getInitialProps(params),
      TrendingCommunitiesWidget.getInitialProps(params),
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

  renderContent() {
    const { tab, tabProps, communityId, communityAlias, subSection } = this.props;

    if (!tab) {
      return <Redirect route="community" params={{ communityAlias }} isTab />;
    }

    return (
      <tab.Component
        {...tabProps}
        communityId={communityId}
        communityAlias={communityAlias}
        subSection={subSection}
      />
    );
  }

  render() {
    const { tabs, tab, community } = this.props;

    if (!community) {
      return <EmptyStub>Community is not found</EmptyStub>;
    }

    const tabId = tab ? tab.id : null;

    return (
      <Wrapper>
        <Header>
          <CommunityHeader community={community} />
          <NavigationTabBar tabs={tabs} params={{ communityAlias: community.alias }} isCommunity />
        </Header>
        <Content
          aside={() => (
            <>
              {tabId !== 'members' ? <MembersWidget communityId={community.id} /> : null}
              <TrendingCommunitiesWidget />
              {tabId !== 'leaders' ? <LeadersWidget communityId={community.id} /> : null}
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
