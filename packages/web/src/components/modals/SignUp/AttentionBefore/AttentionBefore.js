import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CREATE_PASSWORD_SCREEN_ID, MASTER_KEY_SCREEN_ID } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { setRegistrationData } from 'utils/localStore';

import AttentionScreen from 'components/modals/SignUp/common/AttentionScreen';

@withTranslation()
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
    const { t } = this.props;

    return (
      <AttentionScreen
        title={t('modals.sign_up.attentionBefore.title')}
        description={t('modals.sign_up.attentionBefore.description')}
        text={t('modals.sign_up.attentionBefore.text')}
        firstButtonText={t('common.back')}
        firstButtonClick={this.onBackClick}
        secondButtonText={t('modals.sign_up.attentionBefore.continue')}
        secondButtonClick={this.onContinueClick}
      />
    );
  }
}
