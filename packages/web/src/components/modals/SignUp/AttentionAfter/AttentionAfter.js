import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { userType } from 'types';
import { withTranslation } from 'shared/i18n';
import { MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { OPENED_FROM_ONBOARDING_COMMUNITIES } from 'store/constants';
import { removeRegistrationData, setRegistrationData } from 'utils/localStore';

import { createPdf } from 'components/modals/SignUp/utils';
import { trackEvent } from 'utils/analytics';
import { displayError } from 'utils/toastsMessages';
import AttentionScreen from '../common/AttentionScreen';

@withTranslation()
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

  closeModal() {
    const { user, openedFrom, openOnboarding, close } = this.props;

    trackEvent('Click continue (Attention)');

    this.clearRegistrationData();

    if (openedFrom === OPENED_FROM_ONBOARDING_COMMUNITIES) {
      close(user);
    } else {
      close(openOnboarding());
    }
  }

  onContinueClick = () => {
    this.closeModal();
  };

  onSavedClick = () => {
    this.closeModal();
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
    const { wishPassword, isMobile, t } = this.props;
    const { isPdfGenerated } = this.state;

    let screenProps = {};

    if (isMobile) {
      if (!wishPassword) {
        screenProps = {
          firstButtonText: t('common.back'),
          firstButtonClick: this.onBackClick,
          secondButtonText: t('common.continue'),
          secondButtonClick: this.onContinueClick,
        };
      } else {
        screenProps = {
          firstButtonText: t('modals.sign_up.attentionAfter.saved_it'),
          firstButtonClick: this.onSavedClick,
        };
      }
    } else {
      screenProps = {
        firstButtonText: t('modals.sign_up.attentionAfter.download'),
        firstButtonDisabled: !isPdfGenerated,
        firstButtonClick: this.onDownloadClick,
        secondButtonText: t('common.continue'),
        secondButtonClick: this.onContinueClick,
      };
    }

    return (
      <AttentionScreen
        title={t('modals.sign_up.attentionAfter.title')}
        description={t('modals.sign_up.attentionAfter.description')}
        text={t('modals.sign_up.attentionAfter.description')}
        {...screenProps}
      />
    );
  }
}
