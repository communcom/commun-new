import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { CircleLoader, styles, up } from '@commun/ui';

import Redirect from 'components/common/Redirect';
import Footer from 'components/common/Footer';
import TabLoader from 'components/common/TabLoader';
import NavigationTabBar from 'components/common/NavigationTabBar';
import { FastGrowingWidget, PopularPointsWidget } from 'components/wallet';
import withTabs from 'utils/hocs/withTabs';
import { SIDE_BAR_MARGIN } from 'shared/constants';
import { tabInfoType } from 'types';
import TotalBalance from './TotalBalance';

const TABS = [
  {
    id: 'points',
    tabName: 'My Points',
    route: 'wallet',
    index: true,
    Component: dynamic(() => import('./MyPoints')),
  },
  {
    id: 'history',
    tabName: 'History',
    route: 'walletSection',
    Component: dynamic(() => import('./WalletHistory')),
  },
];

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Tabs = styled.div`
  width: 100%;
  background-color: #fff;
`;

const Header = styled.div`
  margin-bottom: 8px;

  ${up.tablet} {
    margin-bottom: 20px;
  }
`;

const Content = styled.div`
  display: flex;
`;

const Left = styled.main`
  flex: 1;
  min-width: 288px;
  width: 100%;
`;

const Right = styled.div`
  display: none;
  flex: 0;
  margin-left: ${SIDE_BAR_MARGIN}px;

  ${up.tablet} {
    display: block;
  }
`;

const Aside = styled.aside`
  display: none;

  ${up.tablet} {
    display: block;

    & > :not(:last-of-type) {
      margin-bottom: 8px;
    }
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const CircleLoaderStyled = styled(CircleLoader)`
  position: static;
`;

const RedirectStyled = styled(Redirect)`
  ${styles.visuallyHidden};
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
    isAuthorized: PropTypes.bool.isRequired,
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.shape({}).isRequired,
    isAutoLogging: PropTypes.bool,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    tab: null,
    isAutoLogging: false,
    isLoading: false,
  };

  renderContent() {
    const { tab, tabProps, router, isLoading } = this.props;

    if (!tab) {
      return <Redirect route="wallet" />;
    }

    if (isLoading) {
      return <TabLoader />;
    }

    return <tab.Component query={router.query} {...tabProps} />;
  }

  render() {
    const { isAuthorized, isAutoLogging } = this.props;

    if (!isAuthorized) {
      return (
        <LoaderWrapper>
          <CircleLoaderStyled />
          {!isAutoLogging ? <RedirectStyled route="home" /> : null}
        </LoaderWrapper>
      );
    }

    return (
      <Wrapper>
        <Header>
          <TotalBalance />
          <Tabs>
            <NavigationTabBar
              tabs={TABS}
              params={
                {
                  /* временный костыль для ререндера табов */
                }
              }
            />
          </Tabs>
        </Header>
        <Content>
          <Left>{this.renderContent()}</Left>
          <Right>
            <Aside>
              <FastGrowingWidget />
              <PopularPointsWidget />
              <Footer />
            </Aside>
          </Right>
        </Content>
      </Wrapper>
    );
  }
}
