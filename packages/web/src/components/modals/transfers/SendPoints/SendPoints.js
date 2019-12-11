import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar, CircleLoader } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { pointType } from 'types/common';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { validateAmount, sanitizeAmount } from 'utils/validatingInputs';

import { InputStyled, HeaderCommunLogo, InputGroup, Error } from '../common.styled';
import BasicTransferModal from '../BasicTransferModal';

const UserItemWrapper = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  padding: 12px;

  width: 100%;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 10px;

  outline: none;
  cursor: pointer;
`;

const AvatarWrapper = styled.div`
  display: flex;

  margin-right: 10px;
`;

const UserName = styled.div`
  flex-grow: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray};
`;

const Open = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  margin-left: 15px;

  width: 24px;
  height: 24px;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;

  color: ${({ theme }) => theme.colors.gray};
`;

const Fee = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};

  opacity: 0.7;
`;

const Hint = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default class SendPoints extends PureComponent {
  static propTypes = {
    sendingPoint: pointType.isRequired,
    selectedUser: PropTypes.shape({}),
    isLoading: PropTypes.bool.isRequired,

    transfer: PropTypes.func.isRequired,
    waitTransactionAndCheckBalance: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedUser: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      sendAmount: '',
      amountError: null,
      selectedUser: props.selectedUser,
      isTransactionStarted: false,
    };
  }

  renderPointCarousel = () => {
    const { sendingPoint } = this.props;

    if (sendingPoint.symbol === COMMUN_SYMBOL) {
      return <HeaderCommunLogo />;
    }

    return <Avatar avatarUrl={sendingPoint.logo} size="large" name={sendingPoint.name} />;
  };

  renderUserItem = () => {
    const { selectedUser } = this.state;

    const openModal = (
      <Open>
        <DropDownIcon />
      </Open>
    );

    if (selectedUser) {
      return (
        <>
          <AvatarWrapper>
            <Avatar avatarUrl={selectedUser.avatarUrl} name={selectedUser.username} />
          </AvatarWrapper>
          <UserName>
            <SubTitle>To</SubTitle>
            <Title>{selectedUser.username}</Title>
          </UserName>
          {openModal}
        </>
      );
    }

    return (
      <>
        <AvatarWrapper>
          <img src="/images/koala.png" width="23" height="21" alt="" />
        </AvatarWrapper>
        <UserName>
          <SubTitle>To</SubTitle>
          <Title>Select user</Title>
        </UserName>
        {openModal}
      </>
    );
  };

  onSelectClickHandler = async () => {
    const { openModalSelectRecipient } = this.props;
    const result = await openModalSelectRecipient();

    if (result) {
      const { selectedUser } = result;
      this.setState({
        selectedUser,
      });
    }
  };

  amountInputChangeHandler = e => {
    const { sendingPoint } = this.props;
    const { value } = e.target;
    const amount = sanitizeAmount(value);

    this.setState({
      sendAmount: amount,
      amountError: validateAmount(amount, sendingPoint),
    });
  };

  renderBody = () => {
    const { isLoading } = this.props;
    const { sendAmount, amountError, isTransactionStarted } = this.state;

    const isError = Boolean(amountError);

    return (
      <>
        <InputGroup>
          <UserItemWrapper
            role="button"
            aria-label="Change user"
            tabIndex="0"
            onClick={this.onSelectClickHandler}
            onKeyDown={this.onSelectClickHandler}
          >
            {this.renderUserItem()}
          </UserItemWrapper>
          <InputStyled
            fluid
            title="Amount"
            value={sendAmount}
            isError={isError}
            onChange={this.amountInputChangeHandler}
          />
          {isLoading || (isTransactionStarted && <CircleLoader />)}
          {isError && <Error>{amountError}</Error>}
        </InputGroup>
        <Hint>This transaction may take some time</Hint>
      </>
    );
  };

  sendPoints = async () => {
    const { sendingPoint, transfer, waitTransactionAndCheckBalance, close } = this.props;
    const { selectedUser, sendAmount } = this.state;

    this.setState({
      isTransactionStarted: true,
    });

    let trxId;
    try {
      const trx = await transfer(selectedUser.userId, sendAmount, sendingPoint.symbol);
      trxId = trx?.processed?.id;

      displaySuccess('Transfer is successful');
    } catch (err) {
      displayError('Transfer is failed');
      // eslint-disable-next-line
      console.warn(err);
    }

    try {
      await waitTransactionAndCheckBalance(trxId);
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }

    this.setState({
      isTransactionStarted: false,
    });

    close();
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { sendingPoint } = this.props;
    const { sendAmount, selectedUser, amountError, isTransactionStarted } = this.state;

    // TODO get percent from point
    const submitButtonText = (
      <>
        Send: {sendAmount} {sendingPoint.name} <Fee>Commission: 0,1{'\u0025'}</Fee>
      </>
    );

    return (
      <BasicTransferModal
        title="Send"
        point={sendingPoint}
        pointCarouselRenderer={this.renderPointCarousel}
        body={this.renderBody()}
        submitButtonText={submitButtonText}
        onSubmitButtonClick={this.sendPoints}
        isSubmitButtonDisabled={!sendAmount || !selectedUser || amountError || isTransactionStarted}
        close={this.closeModal}
      />
    );
  }
}
