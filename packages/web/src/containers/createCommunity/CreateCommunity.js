import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { up } from '@commun/ui';
import { tabInfoType } from 'types';
import withTabs from 'utils/hocs/withTabs';
import { CommunityTab, COMMUNITY_CREATION_KEY, LANGUAGES } from 'shared/constants';
import { getData } from 'utils/localStore';

import AuthGuard from 'components/common/AuthGuard';
import Redirect from 'components/common/Redirect';
import Footer from 'components/common/Footer';
import Content from 'components/common/Content';
import NavigationTabBar from 'components/common/NavigationTabBar';
import { TrendingCommunitiesWidget } from 'components/widgets';
import CreateCommunityHeader from './CreateCommunityHeader';

const CreateDescription = dynamic(() => import('./CreateDescription'));
const CreateRules = dynamic(() => import('./CreateRules'));

const TABS = [
  {
    id: CommunityTab.DESCRIPTION,
    tabLocaleKey: 'description',
    route: 'createCommunity',
    index: true,
    Component: CreateDescription,
  },
  {
    id: CommunityTab.RULES,
    tabLocaleKey: 'rules',
    route: 'createCommunity',
    Component: CreateRules,
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

@withRouter
@withTabs(TABS, 'description')
export default class CreateCommunity extends PureComponent {
  static propTypes = {
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
    communityCreationState: PropTypes.object,
    isAuthorized: PropTypes.bool,

    restoreData: PropTypes.func.isRequired,
    fetchUsersCommunities: PropTypes.func.isRequired,
    getCommunity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tab: null,
    isAuthorized: false,
    communityCreationState: null,
  };

  static async getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  state = {
    communityId: '',
  };

  async componentDidMount() {
    const { restoreData } = this.props;

    const prismData = await this.getPendingCommunityData();
    const storageData = getData(COMMUNITY_CREATION_KEY);
    const data = prismData || storageData;

    if (data) {
      restoreData(data);
    }
  }

  async getPendingCommunityData() {
    const { fetchUsersCommunities, getCommunity } = this.props;

    let data = null;

    try {
      const { communities } = await fetchUsersCommunities();
      const pendingCommunity = communities.find(community => !community.isDone);

      if (pendingCommunity) {
        const { community } = await getCommunity(pendingCommunity.communityId);

        if (!community) {
          return null;
        }

        let language = null;
        let rules = [];

        if (community.language) {
          language = LANGUAGES.find(lang => lang.code === community.language.toUpperCase());
        }

        if (community.rules) {
          try {
            rules = JSON.parse(community.rules);
          } catch (err) {
            // eslint-disable-next-line
            console.warn('Cannot parse community rules', err);
          }
        }

        data = {
          name: community.name,
          avatarUrl: community.avatarUrl || '',
          coverUrl: community.coverUrl || '',
          description: community.description || '',
          language,
          rules,
        };

        this.setState({
          communityId: community.communityId,
        });
      }
    } catch (err) {
      // eslint-disable-next-line
      console.warn('Cannot get community data from prism', err);
    }

    return data;
  }

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return <Redirect route="createCommunity" isTab />;
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { tabs, isAuthorized } = this.props;
    const { communityId } = this.state;

    if (!isAuthorized) {
      return <AuthGuard />;
    }

    return (
      <Wrapper>
        <Header>
          <CreateCommunityHeader communityId={communityId} />
          <NavigationTabBar
            tabs={tabs}
            tabsLocalePath="components.createCommunity.tabs"
            isCommunity
          />
        </Header>
        <Content
          aside={() => (
            <>
              <TrendingCommunitiesWidget />
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
