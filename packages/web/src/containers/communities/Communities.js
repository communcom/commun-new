import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { Button, ButtonWithTooltip, up } from '@commun/ui';

import { tabInfoType } from 'types';
import { CommunitiesTab } from 'shared/constants';
import { FEATURE_COMMUNITY_CREATION } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import withTabs from 'utils/hocs/withTabs';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import Content, { StickyAside } from 'components/common/Content';
import Footer from 'components/common/Footer';
import NavigationTabBar from 'components/common/NavigationTabBar';
import Redirect from 'components/common/Redirect';
import { TabLink } from 'components/common/TabBar/TabBar';
import NotReadyTooltip from 'components/tooltips/NotReadyTooltip';
import { TrendingCommunitiesWidget } from 'components/widgets';
import InviteWidget from 'components/widgets/InviteWidget';
import Discover from './discover';
import Manage from './manage';
import MyCommunities from './my';

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

  ${up.mobileLandscape} {
    padding-right: 15px;
  }
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
  border-radius: 10px 0 0 0;
`;

const Main = styled.div`
  max-width: 100vw;
  padding: 15px 15px 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0 0 10px 10px;

  ${up.tablet} {
    max-width: unset;
  }
`;

const ButtonWithTooltipStyled = styled(ButtonWithTooltip)`
  margin: 0 0 15px auto;
`;

const ButtonStyled = styled(Button)`
  margin: 0 0 15px;

  ${up.mobileLandscape} {
    margin: 0;
  }
`;

const TABS = [
  {
    id: CommunitiesTab.DISCOVER,
    tabLocaleKey: 'discover',
    route: 'communities',
    index: true,
    isOwnerRequired: false,
    Component: Discover,
  },
  {
    id: CommunitiesTab.MY,
    tabLocaleKey: 'my_communities',
    route: 'communities',
    isOwnerRequired: true,
    Component: MyCommunities,
  },
  {
    id: CommunitiesTab.MANAGED,
    tabLocaleKey: 'managed',
    route: 'communities',
    isOwnerRequired: true,
    Component: Manage,
  },
];

@withRouter
@withTabs(TABS, CommunitiesTab.DISCOVER)
@withTranslation()
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
    isMobile: PropTypes.bool,
    isAuthorized: PropTypes.bool,
    isAutoLogging: PropTypes.bool,
    featureFlags: PropTypes.object.isRequired,

    openCreateCommunityConfirmationModal: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: null,
    tab: null,
    isMobile: false,
    isAuthorized: false,
    isAutoLogging: false,
  };

  static async getInitialProps({ store }) {
    return {
      userId: currentUnsafeUserIdSelector(store.getState()) || null,
      namespacesRequired: [],
    };
  }

  onCreateCommunityClick = e => {
    const { openCreateCommunityConfirmationModal } = this.props;

    e.preventDefault();
    openCreateCommunityConfirmationModal();
  };

  onOpenLoginModal = e => {
    const { openLoginModal } = this.props;

    e.preventDefault();
    openLoginModal();
  };

  renderContent() {
    const { tab, tabProps, isAuthorized, isAutoLogging } = this.props;

    if (!tab || (tab.isOwnerRequired && !isAuthorized && !isAutoLogging)) {
      return <Redirect route="communities" />;
    }

    return (
      <tab.Component {...tabProps} isAuthorized={isAuthorized} isAutoLogging={isAutoLogging} />
    );
  }

  renderButtonWithTooltip() {
    const { isMobile, t } = this.props;

    if (isMobile) {
      return (
        <ButtonWithTooltipStyled
          tooltip={closeHandler => <NotReadyTooltip closeHandler={closeHandler} />}
        >
          {t('components.communities.create')}
        </ButtonWithTooltipStyled>
      );
    }
    return (
      <ButtonWithTooltip tooltip={closeHandler => <NotReadyTooltip closeHandler={closeHandler} />}>
        {t('components.communities.create')}
      </ButtonWithTooltip>
    );
  }

  render() {
    const { isOwner, isAuthorized, tabs, isMobile, t, featureFlags } = this.props;

    const createCommunityButton = featureFlags[FEATURE_COMMUNITY_CREATION] ? (
      <ButtonStyled
        primary
        onClick={isAuthorized ? this.onCreateCommunityClick : this.onOpenLoginModal}
      >
        {t('components.communities.create')}
      </ButtonStyled>
    ) : (
      this.renderButtonWithTooltip()
    );

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
                tabsLocalePath="components.communities.tabs"
                isOwner={isOwner}
                renderTabLink={props => <TabLinkStyled {...props} />}
              />
            </Tabs>
            {isMobile ? null : createCommunityButton}
          </Header>
          <Main>
            {isMobile ? createCommunityButton : null}
            {this.renderContent()}
          </Main>
        </Content>
      </Wrapper>
    );
  }
}
