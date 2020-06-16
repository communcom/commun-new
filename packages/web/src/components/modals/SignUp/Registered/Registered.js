import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';
import { withTranslation } from 'shared/i18n';
import { resetCookies } from 'utils/cookies';
import { removeRegistrationData } from 'utils/localStore';

import { SendButton } from '../commonStyled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
`;

const Text = styled.p`
  padding: 10px 0;

  font-weight: 600;
  font-size: 17px;
  line-height: 1;
`;

const SendButtonStyled = styled(SendButton)`
  margin-top: 15px;
`;

/**
 * TODO design needed
 */

@withTranslation()
export default class Oauth extends PureComponent {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  componentDidMount() {
    resetCookies(['commun_oauth_state']);
    removeRegistrationData();
  }

  replaceWithLoginModal = () => {
    const { openModal, close } = this.props;

    close(openModal(SHOW_MODAL_LOGIN));
  };

  render() {
    const { t } = this.props;

    return (
      <Wrapper>
        <Text>{t('modals.sign_up.registered.description')}</Text>
        <SendButtonStyled onClick={this.replaceWithLoginModal}>
          {t('modals.sign_up.registered.sign_in')}
        </SendButtonStyled>
      </Wrapper>
    );
  }
}
