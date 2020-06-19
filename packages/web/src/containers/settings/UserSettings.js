// TODO: commented lines will be implemented after MVP
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ToggleFeature } from '@flopflip/react-redux';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Button, up } from '@commun/ui';

import { FEATURE_SETTINGS_GENERAL, FEATURE_SETTINGS_NOTIFICATIONS } from 'shared/featureFlags';
import { i18n, withTranslation } from 'shared/i18n';

import AuthGuard from 'components/common/AuthGuard';
import Content from 'components/common/Content';
import Footer from 'components/common/Footer';
import { General, Keys, NotificationsSettings } from 'components/pages/settings';
import { TrendingCommunitiesWidget } from 'components/widgets';

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

const Logout = styled(Button).attrs({ danger: true })`
  width: 100%;
  border-radius: 0;
`;

@withTranslation()
export default class UserSettings extends PureComponent {
  static propTypes = {
    // redux
    general: PropTypes.object.isRequired,
    publicKeys: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isAuthorized: PropTypes.bool.isRequired,

    logout: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    fetchAccountPermissions: PropTypes.func.isRequired,
  };

  static getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  async componentDidMount() {
    const { fetchSettings, fetchAccountPermissions } = this.props;

    try {
      // const { user } = await fetchSettings();
      await fetchSettings();
      await fetchAccountPermissions();

      // const locale = user.basic.locale || 'en';
      //
      // console.log(1111, locale);
      //
      // if (i18n.language !== locale) {
      //   i18n.changeLanguage(locale);
      // }
      //
      // if (dayjs.locale() !== locale) {
      //   dayjs.locale(locale);
      // }
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  componentDidUpdate() {
    const { general } = this.props;

    const locale = general.locale || 'en';

    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }

    if (dayjs.locale() !== locale) {
      dayjs.locale(locale);
    }
  }

  settingsChangeHandler = async options => {
    const { updateSettings } = this.props;

    try {
      await updateSettings(options);

      const { basic } = options;

      if (basic && basic.locale) {
        i18n.changeLanguage(basic.locale);
        dayjs.locale(basic.locale);
      }
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  };

  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  renderContent() {
    const { general, publicKeys, isMobile, t } = this.props;

    return (
      <ContentWrapper>
        <ToggleFeature flag={FEATURE_SETTINGS_GENERAL}>
          <General settings={general} onChangeSettings={this.settingsChangeHandler} />
        </ToggleFeature>
        <ToggleFeature flag={FEATURE_SETTINGS_NOTIFICATIONS}>
          <NotificationsSettings />
        </ToggleFeature>
        <Keys publicKeys={publicKeys} /* onChangeSettings={this.settingsChangeHandler} */ />
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
