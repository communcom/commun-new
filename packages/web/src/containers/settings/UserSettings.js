import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';

import { tabInfoType } from 'types';
import { SettingsdTab } from 'shared/constants';
import { FEATURE_SETTINGS_GENERAL, FEATURE_SETTINGS_NOTIFICATIONS } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import withTabs from 'utils/hocs/withTabs';

import AuthGuard from 'components/common/AuthGuard';
import Content, { StickyAside } from 'components/common/Content';
import Footer from 'components/common/Footer';
import SideBarNavigation from 'components/common/SideBarNavigation/SideBarNavigation';
import TabLoader from 'components/common/TabLoader/TabLoader';
import { TrendingCommunitiesWidget } from 'components/widgets';
import General from './general';
import Keys from './keys';
import Notifications from './notifications';

const Wrapper = styled.div`
  flex-basis: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  overflow: hidden;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.white};

  ${up.tablet} {
    border-radius: 6px;
  }
`;

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-bottom: 8px;
`;

const Logout = styled(Button).attrs({ danger: true })`
  width: 100%;
  border-radius: 0;
`;

const TABS = [
  {
    id: SettingsdTab.GENERAL,
    featureName: FEATURE_SETTINGS_GENERAL,
    tabLocaleKey: 'general',
    route: 'settings',
    params: { section: SettingsdTab.GENERAL },
    Component: General,
    index: true,
  },
  {
    id: SettingsdTab.NOTIFICATIONS,
    featureName: FEATURE_SETTINGS_NOTIFICATIONS,
    tabLocaleKey: 'notifications',
    route: 'settings',
    params: { section: SettingsdTab.NOTIFICATIONS },
    Component: Notifications,
  },
  {
    id: SettingsdTab.KEYS,
    tabLocaleKey: 'keys',
    route: 'settings',
    params: { section: SettingsdTab.KEYS },
    Component: Keys,
  },
];

@withRouter
@withTabs(TABS, SettingsdTab.GENERAL)
@withTranslation()
export default class UserSettings extends PureComponent {
  static propTypes = {
    tabs: PropTypes.arrayOf(tabInfoType).isRequired,
    tab: tabInfoType,
    tabProps: PropTypes.object.isRequired,
    // redux
    isMobile: PropTypes.bool.isRequired,
    isAuthorized: PropTypes.bool.isRequired,

    logout: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    fetchAccountPermissions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tab: null,
  };

  static getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  renderContent() {
    const { tab, tabProps, isMobile, t } = this.props;

    if (!tab) {
      return <TabLoader />;
    }

    return (
      <ContentWrapper>
        <tab.Component {...tabProps} />
        {isMobile ? (
          <Logout onClick={this.logoutHandler}>{t('components.settings.logout')}</Logout>
        ) : null}
      </ContentWrapper>
    );
  }

  render() {
    const { isAuthorized } = this.props;

    if (!isAuthorized) {
      return <AuthGuard />;
    }

    return (
      <Wrapper>
        <Content
          aside={() => (
            <StickyAside>
              <SideBarNavigationStyled
                sectionKey="section"
                tabsLocalePath="components.settings.tabs"
                items={TABS}
              />
              <TrendingCommunitiesWidget />
              <Footer />
            </StickyAside>
          )}
        >
          {this.renderContent()}
        </Content>
      </Wrapper>
    );
  }
}
