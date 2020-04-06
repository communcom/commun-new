import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { up } from '@commun/ui';
import { tabInfoType } from 'types';
import withTabs from 'utils/hocs/withTabs';
import {
  CommunityTab,
  COMMUNITY_CREATION_KEY,
  COMMUNITY_CREATION_TOKENS_NUMBER,
} from 'shared/constants';
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
    communBalance: PropTypes.number,

    restoreData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tab: null,
    isAuthorized: false,
    communityCreationState: null,
    communBalance: 0,
  };

  static async getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  componentDidMount() {
    const { restoreData } = this.props;
    const data = getData(COMMUNITY_CREATION_KEY);

    if (data) {
      restoreData(data);
    }
  }

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return <Redirect route="createCommunity" isTab />;
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { tabs, isAuthorized, communBalance } = this.props;

    if (!isAuthorized) {
      return <AuthGuard />;
    }

    if (communBalance <= COMMUNITY_CREATION_TOKENS_NUMBER) {
      return <Redirect route="home" />;
    }

    return (
      <Wrapper>
        <Header>
          <CreateCommunityHeader />
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
