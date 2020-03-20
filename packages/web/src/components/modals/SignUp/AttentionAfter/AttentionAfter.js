import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { userType } from 'types';
import { MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { OPENED_FROM_ONBOARDING_COMMUNITIES } from 'store/constants';
import { removeRegistrationData, setRegistrationData } from 'utils/localStore';

import { createPdf } from 'components/modals/SignUp/utils';
import { trackEvent } from 'utils/analytics';
import { displayError } from 'utils/toastsMessages';
import AttentionScreen from '../common/AttentionScreen';

export default class AttentionAfter extends Component {
  static propTypes = {
    user: userType.isRequired,
    wishPassword: PropTypes.string,
    openedFrom: PropTypes.string,
    pdfData: PropTypes.shape({
      userId: PropTypes.string,
      username: PropTypes.string,
      keys: PropTypes.object,
      phone: PropTypes.string,
    }),
    isMobile: PropTypes.bool,

    setScreenId: PropTypes.func.isRequired,
    openOnboarding: PropTypes.func.isRequired,
    clearRegistrationData: PropTypes.func.isRequired,

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wishPassword: null,
    openedFrom: null,
    pdfData: null,
    isMobile: false,
  };

  state = {
    isPdfGenerated: false,
  };

  async componentDidMount() {
    const { pdfData, isMobile } = this.props;

    trackEvent('Open screen Attention');

    if (!isMobile) {
      this.openPdf = await createPdf(pdfData);
      this.setState({
        isPdfGenerated: true,
      });
    }
  }

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

    trackEvent('Click continue (Attention)');

    if (openedFrom === OPENED_FROM_ONBOARDING_COMMUNITIES) {
      close(user);
    } else {
      close(openOnboarding());
    }
  };

  onSavedClick = () => {
    const { openOnboarding, close } = this.props;

    this.clearRegistrationData();

    trackEvent('Click continue (Attention)');

    close(openOnboarding());
  };

  onDownloadClick = () => {
    try {
      this.openPdf();

      trackEvent('Click PDF (Attention)');
    } catch (err) {
      displayError('PDF download failed:', err);
    }
  };

  render() {
    const { wishPassword, isMobile } = this.props;
    const { isPdfGenerated } = this.state;

    let screenProps = {};

    if (isMobile) {
      if (!wishPassword) {
        screenProps = {
          firstButtonText: 'Back',
          firstButtonClick: this.onBackClick,
          secondButtonText: 'Continue',
          secondButtonClick: this.onContinueClick,
        };
      } else {
        screenProps = {
          firstButtonText: 'I saved it',
          firstButtonClick: this.onSavedClick,
        };
      }
    } else {
      screenProps = {
        firstButtonText: 'Download PDF with Password',
        firstButtonDisabled: !isPdfGenerated,
        firstButtonClick: this.onDownloadClick,
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
