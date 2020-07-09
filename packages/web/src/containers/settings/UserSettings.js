import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

import { tabInfoType } from 'types';
import { SettingsdTab } from 'shared/constants';
import {
  FEATURE_SETTINGS_CHANGE_KEYS,
  FEATURE_SETTINGS_GENERAL,
  FEATURE_SETTINGS_NOTIFICATIONS,
} from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import withTabs from 'utils/hocs/withTabs';

import AuthGuard from 'components/common/AuthGuard';
import Content, { StickyAside } from 'components/common/Content';
import Footer from 'components/common/Footer';
import SideBarNavigation from 'components/common/SideBarNavigation';
import TabLoader from 'components/common/TabLoader/TabLoader';
import { TrendingCommunitiesWidget } from 'components/widgets';
import General from './general';
import CurrentKeys from './keys/CurrentKeys';
import ResetKeys from './keys/ResetKeys';
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

const Header = styled.header`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px 15px 10px;
  background-color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;

  ${up.tablet} {
    justify-content: flex-start;
    padding: 15px;
    font-size: 17px;
    line-height: 23px;
  }
`;

const BackLink = styled.a`
  position: absolute;
  top: 10px;
  left: 0;
  display: flex;
  padding: 10px 20px;
  color: ${({ theme }) => theme.colors.black};
`;

const BackIcon = styled(Icon).attrs({ name: 'back' })`
  width: 12px;
  height: 20px;
`;

const MobileFilterWrapper = styled.div`
  display: flex;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white};

  & > :not(:last-child) {
    margin-right: 5px;
  }
`;

const SideBarNavigationStyled = styled(SideBarNavigation)`
  margin-bottom: 8px;
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
    subRoutes: [
      {
        id: SettingsdTab.CURRENT_KEYS,
        tabLocaleKey: 'current_keys',
        params: { section: SettingsdTab.KEYS, subSection: SettingsdTab.CURRENT_KEYS },
        Component: CurrentKeys,
      },
      {
        id: SettingsdTab.NEW_KEYS,
        featureName: FEATURE_SETTINGS_CHANGE_KEYS,
        tabLocaleKey: 'new_keys',
        params: { section: SettingsdTab.KEYS, subSection: SettingsdTab.NEW_KEYS },
        Component: ResetKeys,
      },
    ],
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
    isDesktop: PropTypes.bool.isRequired,
    isAuthorized: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    tab: null,
  };

  static getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  renderContent() {
    const { tab, tabProps } = this.props;

    if (!tab) {
      return <TabLoader />;
    }

    return <tab.Component {...tabProps} />;
  }

  render() {
    const { isAuthorized, isMobile, isDesktop, t } = this.props;

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
                subSectionKey="subSection"
                tabsLocalePath="components.settings.tabs"
                items={TABS}
              />
              <TrendingCommunitiesWidget />
              <Footer />
            </StickyAside>
          )}
        >
          <ContentWrapper>
            {!isDesktop ? (
              <Header>
                {isMobile ? (
                  <Link route="home" passHref>
                    <BackLink>
                      <BackIcon />
                    </BackLink>
                  </Link>
                ) : null}
                {t('components.settings.title')}
              </Header>
            ) : null}
            {!isDesktop ? (
              <MobileFilterWrapper>
                <SideBarNavigation
                  sectionKey="section"
                  subSectionKey="subSection"
                  tabsLocalePath="components.settings.tabs"
                  items={TABS}
                  isRow
                />
              </MobileFilterWrapper>
            ) : null}
            {this.renderContent()}
          </ContentWrapper>
        </Content>
      </Wrapper>
    );
  }
}
