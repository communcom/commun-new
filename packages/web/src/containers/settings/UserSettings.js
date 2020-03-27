// TODO: commented lines will be implemented after MVP
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import dayjs from 'dayjs';
import { ToggleFeature } from '@flopflip/react-redux';
// import { i18n } from 'shared/i18n';
import { FEATURE_NOTIFICATION_OPTIONS } from 'shared/featureFlags';
import { withTranslation } from 'shared/i18n';

import { Button, up } from '@commun/ui';

import { TrendingCommunitiesWidget } from 'components/widgets';
import { /* General, */ NotificationsSettings, Keys } from 'components/settings';
import Content from 'components/common/Content';
import Footer from 'components/common/Footer';
import AuthGuard from 'components/common/AuthGuard';

const Wrapper = styled.div`
  flex-basis: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;

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
    general: PropTypes.shape({}).isRequired,
    notifications: PropTypes.shape({}).isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
    isMobile: PropTypes.bool.isRequired,
    isAuthorized: PropTypes.bool.isRequired,

    logout: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
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
      /* const { basic } = */ await fetchSettings();
      await fetchAccountPermissions();

      // if (i18n.language !== basic.locale) {
      //   i18n.changeLanguage(basic.locale);
      // }

      // if (dayjs.locale() !== basic.locale) {
      //   dayjs.locale(basic.locale);
      // }
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  }

  // componentDidUpdate() {
  //   const {
  //     general: { locale },
  //   } = this.props;

  //   if (i18n.language !== locale) {
  //     i18n.changeLanguage(locale);
  //   }

  //   if (dayjs.locale() !== locale) {
  //     dayjs.locale(locale);
  //   }
  // }

  // settingsChangeHandler = async options => {
  //   const { saveSettings } = this.props;
  //   const { basic } = options;
  //
  //   try {
  //     await saveSettings(options);
  //
  //     if (basic && basic.locale) {
  //       i18n.changeLanguage(basic.locale);
  //       dayjs.locale(basic.locale);
  //     }
  //   } catch (err) {
  //     // eslint-disable-next-line
  //     console.warn(err);
  //   }
  // };

  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  renderContent() {
    const { /* general, */ publicKeys, isMobile, isAuthorized, t } = this.props;

    if (!isAuthorized) {
      return <AuthGuard />;
    }

    return (
      <ContentWrapper>
        {/* <General settings={general} onChangeSettings={this.settingsChangeHandler} /> */}
        <ToggleFeature flag={FEATURE_NOTIFICATION_OPTIONS}>
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
