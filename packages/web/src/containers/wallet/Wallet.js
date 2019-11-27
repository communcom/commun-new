import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sticky from 'react-stickynode';
import { withRouter } from 'next/router';

import { CircleLoader, styles, up, CONTAINER_DESKTOP_PADDING } from '@commun/ui';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';
import { HEADER_DESKTOP_HEIGHT } from 'components/common/Header';
import Redirect from 'components/common/Redirect';
import Footer from 'components/common/Footer';
import Content from 'components/common/Content';
import NavigationTabBar from 'components/common/NavigationTabBar';
import withTabs from 'utils/hocs/withTabs';
import { tabInfoType } from 'types';

import { PointInfoPanel } from 'components/wallet/panels';

import TotalBalance from './TotalBalance';
import MyPoints from './MyPoints';
// import WalletHistory from './WalletHistory';

const TABS = [
  {
    id: 'points',
    tabName: 'My Points',
    route: 'wallet',
    index: true,
    Component: MyPoints,
  },
  // {
  //   id: 'history',
  //   tabName: 'History',
  //   route: 'walletSection',
  //   Component: WalletHistory,
  // },
];

const Wrapper = styled.div`
  flex: 1;

  overflow: hidden;
`;

const Tabs = styled.div`
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  margin-bottom: 8px;

  ${up.tablet} {
    margin-bottom: 20px;
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

const RightWrapper = styled.div`
  width: ${RIGHT_SIDE_BAR_WIDTH}px;
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
    isAutoLogging: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    tab: null,
    isAutoLogging: false,
  };

  renderContent() {
    const { tab, tabProps, router } = this.props;

    if (!tab) {
      return <Redirect route="wallet" />;
    }

    return <tab.Component query={router.query} {...tabProps} />;
  }

  render() {
    const { isAuthorized, isAutoLogging, tabs, isMobile } = this.props;

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
        <Content
          aside={() => (
            <RightWrapper>
              <Sticky top={HEADER_DESKTOP_HEIGHT + CONTAINER_DESKTOP_PADDING}>
                <PointInfoPanel />
                <Footer />
              </Sticky>
            </RightWrapper>
          )}
        >
          <Header>
            <TotalBalance />
            {!isMobile && (
              <Tabs>
                <NavigationTabBar tabs={tabs} />
              </Tabs>
            )}
          </Header>

          {this.renderContent()}
        </Content>
      </Wrapper>
    );
  }
}
