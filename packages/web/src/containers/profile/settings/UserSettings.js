// TODO: commented lines will be implemented after MVP
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import dayjs from 'dayjs';
import { ToggleFeature } from '@flopflip/react-redux';
// import { i18n } from 'shared/i18n';
import { FEATURE_NOTIFICATION_OPTIONS } from 'shared/featureFlags';

import { Button, up } from '@commun/ui';
import { /* General, */ Notifications, Keys } from 'components/profile/settings';
import TabLoader from 'components/common/TabLoader';

const Wrapper = styled.div`
  overflow: hidden;
  margin-bottom: 8px;

  ${up.tablet} {
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
  }
`;

const Logout = styled(Button).attrs({ danger: true })`
  width: 100%;
  border-radius: 0;
`;

export default class UserSettings extends PureComponent {
  static propTypes = {
    // redux
    general: PropTypes.shape({}).isRequired,
    notifications: PropTypes.shape({}).isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
    isMobile: PropTypes.bool.isRequired,

    logout: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    fetchAccountPermissions: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
  };

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

      this.setState({
        isLoading: false,
      });
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

  settingsChangeHandler = async options => {
    const { saveSettings } = this.props;
    // const { basic } = options;
    try {
      await saveSettings(options);

      // if (basic && basic.locale) {
      //   i18n.changeLanguage(basic.locale);
      //   dayjs.locale(basic.locale);
      // }
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
  };

  logoutHandler = () => {
    const { logout } = this.props;
    logout();
  };

  render() {
    const { /* general, */ notifications, publicKeys, isMobile } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return <TabLoader />;
    }

    return (
      <Wrapper>
        {/* <General settings={general} onChangeSettings={this.settingsChangeHandler} /> */}
        <ToggleFeature flag={FEATURE_NOTIFICATION_OPTIONS}>
          <Notifications settings={notifications} onChangeSettings={this.settingsChangeHandler} />
        </ToggleFeature>
        <Keys publicKeys={publicKeys} /* onChangeSettings={this.settingsChangeHandler} */ />
        {isMobile ? <Logout onClick={this.logoutHandler}>Logout</Logout> : null}
      </Wrapper>
    );
  }
}
