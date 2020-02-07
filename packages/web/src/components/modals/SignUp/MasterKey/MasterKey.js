import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, Button } from '@commun/ui';

import { displayError } from 'utils/toastsMessages';
import { gevent } from 'utils/analytics';
import { replaceRouteAndAddQuery } from 'utils/router';
import { CREATE_USERNAME_SCREEN_ID } from 'shared/constants';
import { removeRegistrationData, setRegistrationData } from 'utils/localStore';
import SplashLoader from 'components/common/SplashLoader';

import { createPdf } from '../utils';
import { ErrorTextAbsolute, BackButton } from '../commonStyled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 23px 23px 20px;
`;

const StepImage = styled.img`
  width: 282px;
  height: 280px;
`;

const CongratulationsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const PasswordBlock = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 120px;
  margin-top: 8px;
`;

const InputStyled = styled(Input)`
  width: 100%;
`;

const ScreenTitle = styled.h3`
  width: 270px;
  margin-top: 18px;
  line-height: 33px;
  font-size: 25px;
  font-weight: normal;
  text-align: center;
`;

const ScreenBoldTitle = styled.b`
  font-size: 27px;
  font-weight: bold;
`;

const ScreenText = styled.p`
  margin: 15px 0 0;
  line-height: 22px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const SaveIt = styled.b`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const ButtonStyled = styled(Button)`
  display: block;
  width: 100%;
`;

export default class MasterKey extends Component {
  static propTypes = {
    masterPassword: PropTypes.string,
    setScreenId: PropTypes.func.isRequired,
    fetchToBlockChain: PropTypes.func.isRequired,
    isLoadingBlockChain: PropTypes.bool.isRequired,
    retinaSuffix: PropTypes.string.isRequired,
    blockChainError: PropTypes.string.isRequired,
    blockChainStopLoader: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    openOnboarding: PropTypes.func.isRequired,
    clearRegistrationData: PropTypes.func.isRequired,

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    masterPassword: null,
  };

  state = {
    isPdfGenerated: false,
  };

  componentDidMount() {
    this.sendToBlockChain();
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(CREATE_USERNAME_SCREEN_ID);
    setRegistrationData({ screenId: CREATE_USERNAME_SCREEN_ID });
  };

  onRetryClick = () => {
    this.sendToBlockChain();
  };

  onDownloadClick = async () => {
    const { openOnboarding, close } = this.props;

    try {
      this.openPdf();
    } catch (err) {
      displayError('PDF generating failed:', err);
    }

    this.clearRegistrationData();
    close();

    openOnboarding();
  };

  async sendToBlockChain() {
    const { fetchToBlockChain, blockChainStopLoader, setScreenId } = this.props;

    try {
      const result = await fetchToBlockChain();

      if (!result) {
        return;
      }

      if (typeof result === 'string') {
        setScreenId(result);
        setRegistrationData({ screenId: result });
        return;
      }

      removeRegistrationData();

      gevent('conversion', {
        allow_custom_scripts: true,
        send_to: 'DC-9830171/invmedia/commu0+standard',
      });

      gevent('registration-completed');

      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration');
      }

      replaceRouteAndAddQuery({
        invite: result.userId,
        step: 'keys', // for analytics
      });

      this.openPdf = await createPdf(result);

      // TODO: it's emulation of forceUpdate. isn't cool
      this.setState({
        isPdfGenerated: true,
      });
    } catch (err) {
      displayError(err);
    } finally {
      blockChainStopLoader();
    }
  }

  clearRegistrationData() {
    const { clearRegistrationData } = this.props;
    clearRegistrationData();
    removeRegistrationData();
  }

  render() {
    const { isLoadingBlockChain, blockChainError, masterPassword, retinaSuffix } = this.props;
    const { isPdfGenerated } = this.state;

    return (
      <Wrapper>
        {isLoadingBlockChain ? <SplashLoader /> : null}
        <StepImage src={`/images/save-key${retinaSuffix}.png`} />
        <CongratulationsWrapper>
          <ScreenTitle>
            <ScreenBoldTitle>Master password</ScreenBoldTitle>
            <br />
            has been generated
          </ScreenTitle>
          <ScreenText>
            You need the master password to Log in
            <br />
            We don’t keep and can’t restore passwords
            <br />
            <SaveIt>Save it securely!</SaveIt>
          </ScreenText>
          <ErrorTextAbsolute>{blockChainError}</ErrorTextAbsolute>
        </CongratulationsWrapper>
        <PasswordBlock>
          {masterPassword ? (
            <InputStyled
              title="Master password"
              className="js-MasterPassword"
              value={masterPassword}
              readOnly
              allowCopy
            />
          ) : null}
        </PasswordBlock>
        {blockChainError ? (
          <>
            <ButtonStyled primary big className="js-MasterKeyDownload" onClick={this.onRetryClick}>
              Retry
            </ButtonStyled>
            <BackButton className="js-VerificationCodeBack" onClick={this.backToPreviousScreen}>
              Back
            </BackButton>
          </>
        ) : (
          <ButtonStyled
            primary
            big
            disabled={!isPdfGenerated}
            className="js-MasterKeyDownload"
            onClick={this.onDownloadClick}
          >
            Download PDF
          </ButtonStyled>
        )}
      </Wrapper>
    );
  }
}
