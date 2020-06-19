import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { tabInfoType } from 'types';
import withTabs from 'utils/hocs/withTabs';

import AuthGuard from 'components/common/AuthGuard';
import Content, { StickyAside } from 'components/common/Content';
import Footer from 'components/common/Footer';
import NavigationTabBar from 'components/common/NavigationTabBar';
import Redirect from 'components/common/Redirect';
import { PointInfoPanel } from 'components/pages/wallet/panels';
import MyPoints from './MyPoints';
import TotalBalance from './TotalBalance';
import WalletHistory from './WalletHistory';

const TABS = [
  {
    id: 'points',
    tabLocaleKey: 'my_points',
    route: 'wallet',
    index: true,
    Component: MyPoints,
  },
  {
    id: 'history',
    tabLocaleKey: 'history',
    route: 'walletSection',
    Component: WalletHistory,
  },
];

const Wrapper = styled.div`
  flex: 1;

  overflow: hidden;
`;

const Tabs = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};

  ${up.tablet} {
    border-radius: 0 0 6px 6px;
  }
`;

const Header = styled.div`
  margin-bottom: 8px;

  ${up.tablet} {
    margin-bottom: 10px;
  }
`;

@withRouter
@withTabs(TABS, 'points')
export default class Wallet extends PureComponent {
  static async getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  static propTypes = {
    router: PropTypes.shape({
      query: PropTypes.objectOf(PropTypes.string).isRequired,
    }).isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,

    isAuthorized: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    tab: null,
  };

  renderContent() {
    const { tab, tabProps, router } = this.props;

    if (!tab) {
      return <Redirect route="wallet" isTab />;
    }

    return <tab.Component query={router.query} {...tabProps} />;
  }

  render() {
    const { isAuthorized, tabs, isMobile } = this.props;

    if (!isAuthorized) {
      return <AuthGuard />;
    }

    return (
      <Wrapper>
        <Content
          aside={() => (
            <StickyAside>
              <PointInfoPanel isAside />
              <Footer />
            </StickyAside>
          )}
        >
          <Header>
            <TotalBalance />
            {!isMobile && (
              <Tabs>
                <NavigationTabBar tabs={tabs} tabsLocalePath="components.wallet.tabs" />
              </Tabs>
            )}
          </Header>

          {this.renderContent()}
        </Content>
      </Wrapper>
    );
  }
}
