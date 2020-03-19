import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AttentionScreen from 'components/modals/SignUp/common/AttentionScreen';
import { CREATE_PASSWORD_SCREEN_ID, MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { setRegistrationData } from 'utils/localStore';

export default class AttentionBefore extends Component {
  static propTypes = {
    setScreenId: PropTypes.func.isRequired,
  };

  onBackClick = () => {
    const { setScreenId } = this.props;
    setScreenId(CREATE_PASSWORD_SCREEN_ID);
    setRegistrationData({ screenId: CREATE_PASSWORD_SCREEN_ID });
  };

  onContinueClick = () => {
    const { setScreenId } = this.props;
    setScreenId(MASTER_KEY_SCREEN_ID);
    setRegistrationData({ screenId: MASTER_KEY_SCREEN_ID });
  };

  render() {
    return (
      <AttentionScreen
        title="Attention"
        description="You want to select the advanced mode and continue with the Master Password"
        text={
          <>
            After confirmation, we&apos;ll generate for you a 52-character crypto password.
            <br />
            We suggest you copy this password or download a PDF file with it.
            <br />
            We do not keep Master Passwords and have no opportunity to restore them.
            <br />
            <br />
            We strongly recommend you to save your password and make its copy.
          </>
        }
        firstButtonText="Back"
        firstButtonClick={this.onBackClick}
        secondButtonText="Continue with Master Password"
        secondButtonClick={this.onContinueClick}
      />
    );
  }
}
