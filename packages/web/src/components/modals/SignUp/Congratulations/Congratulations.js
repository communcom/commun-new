import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

import { removeRegistrationData } from 'utils/localStore';
import { Circle, LastScreenTitle, LastScreenSubTitle, SendButton } from '../commonStyled';

const Start = styled(SendButton)`
  margin: 98px 0 23px;
`;

export default class Congratulations extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    clearRegistrationData: PropTypes.func.isRequired,
    openOnboarding: PropTypes.func.isRequired,
  };

  startClick = debounce(() => {
    const { close, openOnboarding } = this.props;
    this.clearRegistrationData();

    setTimeout(() => {
      openOnboarding();
    }, 1000);

    close();
  }, 300);

  clearRegistrationData() {
    const { clearRegistrationData } = this.props;
    clearRegistrationData();
    removeRegistrationData();
  }

  render() {
    return (
      <>
        <Circle />
        <LastScreenTitle>Congratulations!</LastScreenTitle>
        <LastScreenSubTitle>You&apos;ve been registered successfully</LastScreenSubTitle>
        <Start className="js-CongratulationsStart" onClick={this.startClick}>
          Start
        </Start>
      </>
    );
  }
}
