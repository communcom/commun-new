import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { userType } from 'types';
import { MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { OPENED_FROM_ONBOARDING_COMMUNITIES } from 'store/constants';
import { removeRegistrationData, setRegistrationData } from 'utils/localStore';

import AttentionScreen from '../common/AttentionScreen';

export default class AttentionAfter extends Component {
  static propTypes = {
    user: userType.isRequired,
    openedFrom: PropTypes.string,
    isMobile: PropTypes.string,

    setScreenId: PropTypes.func.isRequired,
    openOnboarding: PropTypes.func.isRequired,
    clearRegistrationData: PropTypes.func.isRequired,

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    openedFrom: null,
    isMobile: false,
  };

  clearRegistrationData() {
    const { clearRegistrationData } = this.props;
    clearRegistrationData();
    removeRegistrationData();
  }

  onBackClick = () => {
    const { setScreenId } = this.props;
    setScreenId(MASTER_KEY_SCREEN_ID);
    setRegistrationData({ screenId: MASTER_KEY_SCREEN_ID });
  };

  onContinueClick = () => {
    const { user, openedFrom, openOnboarding, close } = this.props;

    this.clearRegistrationData();

    if (openedFrom === OPENED_FROM_ONBOARDING_COMMUNITIES) {
      close(user);
    } else {
      close(openOnboarding());
    }
  };

  onSavedClick = () => {
    const { openOnboarding, close } = this.props;

    this.clearRegistrationData();

    close(openOnboarding());
  };

  render() {
    const { isMobile } = this.props;

    let screenProps = {};

    if (isMobile) {
      screenProps = {
        firstButtonText: 'I saved it',
        firstButtonClick: this.onSavedClick,
      };
    } else {
      screenProps = {
        firstButtonText: 'Back',
        firstButtonClick: this.onBackClick,
        secondButtonText: 'Continue',
        secondButtonClick: this.onContinueClick,
      };
    }

    return (
      <AttentionScreen
        title="Attention"
        description="We do not keep master passwords and have no opportunity to restore them."
        text={
          <>
            Unfortunately, blockchain doesn’t allow us to restore passwords. It means that it is a
            user’s responsibility to keep the password in a safe place to be able to access it
            anytime.
            <br />
            <br />
            We strongly recommend you to save your password and make its copy.
          </>
        }
        {...screenProps}
      />
    );
  }
}
