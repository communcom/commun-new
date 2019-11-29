import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CircleLoader, Input, Button } from '@commun/ui';

import { displayError } from 'utils/toastsMessages';
import { CREATE_USERNAME_SCREEN_ID } from 'shared/constants';
import { removeRegistrationData, setRegistrationData } from 'utils/localStore';

import { createPdf } from '../utils';
import { ErrorText, BackButton } from '../commonStyled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 23px 35px 30px;
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
  margin-top: 24px;
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

const CustomErrorText = styled(ErrorText)`
  left: 50%;
  transform: translateX(-50%);
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
  margin: 15px -12px 0;
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

      this.openPdf = await createPdf(result);

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
    const { isLoadingBlockChain, blockChainError, masterPassword } = this.props;
    const { isPdfGenerated } = this.state;

    return (
      <Wrapper>
        {isLoadingBlockChain ? <CircleLoader /> : null}
        <StepImage src="/images/save-key.png" />
        <CongratulationsWrapper>
          <ScreenTitle>
            <ScreenBoldTitle>You owner </ScreenBoldTitle>
            <br />
            of your identity
          </ScreenTitle>
          <ScreenText>
            Commun doesn’t have access to your password, and also in case of loss will not be able
            to recover it.
            <br />
            <SaveIt>Save it securely!</SaveIt>
          </ScreenText>
          <CustomErrorText>{blockChainError}</CustomErrorText>
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
