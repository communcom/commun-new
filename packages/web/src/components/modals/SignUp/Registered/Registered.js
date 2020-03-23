import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SHOW_MODAL_LOGIN } from 'store/constants/modalTypes';

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

export default class Oauth extends PureComponent {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  replaceWithLoginModal = () => {
    const { openModal, close } = this.props;

    resetCookies(['commun_oauth_state']);
    removeRegistrationData();

    close(openModal(SHOW_MODAL_LOGIN));
  };

  render() {
    return (
      <Wrapper>
        <Text>It looks like you are registered</Text>
        <SendButtonStyled onClick={this.replaceWithLoginModal}>Log in</SendButtonStyled>
      </Wrapper>
    );
  }
}
