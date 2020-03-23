import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Input, Button } from '@commun/ui';

import { ANALYTIC_PASSWORD_BACKUPED, ANALYTIC_PASSWORD_COPY } from 'shared/constants/analytics';
import { displayError } from 'utils/toastsMessages';
import { trackEvent } from 'utils/analytics';
import { ATTENTION_AFTER_SCREEN_ID, CREATE_USERNAME_SCREEN_ID } from 'shared/constants';
import { setRegistrationData } from 'utils/localStore';
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
  margin-bottom: 8px;
  text-align: center;
`;

const PasswordBlock = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 84px;
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
  margin-bottom: 12px;
`;

export default class MasterKey extends Component {
  static propTypes = {
    wishPassword: PropTypes.string,
    masterPassword: PropTypes.string,
    retinaSuffix: PropTypes.string.isRequired,
    blockChainError: PropTypes.string.isRequired,
    isLoadingBlockChain: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    pdfData: PropTypes.shape({
      userId: PropTypes.string,
      username: PropTypes.string,
      keys: PropTypes.object,
      phone: PropTypes.string,
    }),

    blockChainStopLoader: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
    registrationUser: PropTypes.func.isRequired,
    setScreenId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wishPassword: null,
    masterPassword: null,
    isMobile: false,
    pdfData: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isPdfGenerated: false,
    };
  }

  async componentDidMount() {
    const { wishPassword, masterPassword, pdfData } = this.props;

    if (wishPassword) {
      trackEvent('Open screen save your password (easy)');
    } else {
      trackEvent('Open screen 1.1.5');
    }

    if (!masterPassword) {
      this.sendToBlockChain();
    } else {
      this.openPdf = await createPdf(pdfData);
      this.setState({
        isPdfGenerated: true,
      });
    }
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  onDownloadClick = () => {
    const { wishPassword } = this.props;

    try {
      this.openPdf();

      if (wishPassword) {
        trackEvent('Click PDF (easy)');
      } else {
        trackEvent(ANALYTIC_PASSWORD_BACKUPED, { answer: 'PDF' });
      }
    } catch (err) {
      displayError('PDF download failed:', err);
    }
  };

  async sendToBlockChain() {
    const { blockChainStopLoader, registrationUser, setScreenId } = this.props;

    try {
      const result = await registrationUser();

      if (!result) {
        return;
      }

      if (typeof result === 'string') {
        setScreenId(result);
        setRegistrationData({ screenId: result });
        return;
      }

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

  onPasswordCopy = () => {
    trackEvent(ANALYTIC_PASSWORD_COPY);
  };

  onRetryClick = () => {
    this.sendToBlockChain();
  };

  onSavedClick = () => {
    const { wishPassword, setScreenId } = this.props;

    if (wishPassword) {
      trackEvent('Click i save it (easy)');
    }

    setScreenId(ATTENTION_AFTER_SCREEN_ID);
    setRegistrationData({ screenId: ATTENTION_AFTER_SCREEN_ID });
  };

  backToPreviousScreen = () => {
    const { setScreenId } = this.props;
    setScreenId(CREATE_USERNAME_SCREEN_ID);
    setRegistrationData({ screenId: CREATE_USERNAME_SCREEN_ID });
  };

  render() {
    const {
      blockChainError,
      wishPassword,
      masterPassword,
      retinaSuffix,
      isMobile,
      isLoadingBlockChain,
    } = this.props;
    const { isPdfGenerated } = this.state;

    return (
      <Wrapper>
        {isLoadingBlockChain ? <SplashLoader /> : null}
        <StepImage src={`/images/save-key${retinaSuffix}.png`} />
        <CongratulationsWrapper>
          <ScreenTitle>
            <ScreenBoldTitle>{wishPassword ? 'Your password' : 'Master password'}</ScreenBoldTitle>
            <br />
            has been {wishPassword ? 'created' : 'generated'}
          </ScreenTitle>
          <ScreenText>
            You need the {!wishPassword ? 'master' : ''} password to Log in
            <br />
            We don’t keep and can’t restore passwords
            <br />
            <SaveIt>Save it securely!</SaveIt>
          </ScreenText>
          <ErrorTextAbsolute>{blockChainError}</ErrorTextAbsolute>
        </CongratulationsWrapper>
        <PasswordBlock>
          {!wishPassword && masterPassword ? (
            <InputStyled
              title="Master password"
              className="js-MasterPassword"
              value={masterPassword}
              readOnly
              allowCopy
              onCopy={this.onPasswordCopy}
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
          <>
            {!isMobile ? (
              <ButtonStyled
                primary
                big
                disabled={!isPdfGenerated}
                className="js-MasterKeyDownload"
                onClick={this.onDownloadClick}
              >
                Download PDF
              </ButtonStyled>
            ) : null}
            <Button small hollow transparent onClick={this.onSavedClick}>
              I saved it
            </Button>
          </>
        )}
      </Wrapper>
    );
  }
}
