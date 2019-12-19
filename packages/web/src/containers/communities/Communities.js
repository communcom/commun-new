import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { tabInfoType } from 'types';
import { CommunitiesTab } from 'shared/constants';
import withTabs from 'utils/hocs/withTabs';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import TabLoader from 'components/common/TabLoader/TabLoader';
import NavigationTabBar from 'components/common/NavigationTabBar';
import { TabLink } from 'components/common/TabBar/TabBar';
import InviteWidget from 'components/widgets/InviteWidget';
import { TrendingCommunitiesWidget } from 'components/widgets';
import Content, { StickyAside } from 'components/common/Content';
import Footer from 'components/common/Footer';
import MyCommunities from './my';
import Discover from './discover';
import Manage from './manage';

const Wrapper = styled.div`
  flex-basis: 100%;
`;

const FooterStyled = styled(Footer)`
  padding-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const Tabs = styled.div`
  display: inline-block;
`;

const TabLinkStyled = styled(TabLink)`
  height: 50px;
  line-height: 50px;
`;

const NavigationTabBarStyled = styled(NavigationTabBar)`
  height: 50px;
`;

// const CreateButton = styled(Button)`
//   margin-right: 15px;
// `;

const Main = styled.div`
  padding: 15px 15px 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0 0 10px 10px;
  overflow: hidden;
`;

const TABS = [
  {
    id: CommunitiesTab.DISCOVER,
    tabName: 'Discover',
    route: 'communities',
    index: true,
    isOwnerRequired: false,
    Component: Discover,
  },
  {
    id: CommunitiesTab.MY,
    tabName: 'My communities',
    route: 'communities',
    isOwnerRequired: true,
    Component: MyCommunities,
  },
  {
    id: CommunitiesTab.MANAGED,
    tabName: 'Managed',
    route: 'communities',
    isOwnerRequired: true,
    Component: Manage,
  },
];

@withRouter
@withTabs(TABS, CommunitiesTab.DISCOVER)
export default class Communities extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    userId: null,
    tab: null,
  };

  static async getInitialProps({ store }) {
    return {
      userId: currentUnsafeUserIdSelector(store.getState()) || null,
      namespacesRequired: [],
    };
  }

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return (
        <>
          <TabLoader />
        </>
      );
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { isOwner, tabs } = this.props;

    return (
      <Wrapper>
        <Content
          aside={() => (
            <StickyAside>
              <InviteWidget />
              <TrendingCommunitiesWidget />
              {/* <Advertisement advId={HOME_PAGE_ADV_ID} /> */}
              <FooterStyled />
            </StickyAside>
          )}
        >
          <Header>
            <Tabs>
              <NavigationTabBarStyled
                tabs={tabs}
                isOwner={isOwner}
                renderTabLink={props => <TabLinkStyled {...props} />}
              />
            </Tabs>
            {/* <CreateButton primary>Create community</CreateButton> */}
          </Header>
          <Main>{this.renderContent()}</Main>
        </Content>
      </Wrapper>
    );
  }
}
