/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar, SplashLoader, KEY_CODES } from '@commun/ui';

import { COMMUN_SYMBOL } from 'shared/constants';
import { pointType } from 'types/common';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { validateAmount, sanitizeAmount } from 'utils/validatingInputs';
import { calculateFee } from 'utils/wallet';

import CurrencyCarousel from 'components/wallet/CurrencyCarousel';

import { InputStyled, InputGroup, Error } from '../common.styled';
import BasicTransferModal from '../BasicTransferModal';

const UserItemWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
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
  font-size: 15px;
  font-weight: 600;
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
  width: 24px;
  height: 24px;
  margin-left: 15px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  cursor: pointer;
`;

const DropDownIcon = styled(Icon).attrs({ name: 'chevron' })`
  width: 16px;
  height: 16px;

  color: ${({ theme }) => theme.colors.gray};
`;

const FeeLine = styled.span`
  display: block;
  margin-bottom: -1px;
`;

const FeeText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.7;
`;

const FireIcon = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 4px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAA21BMVEUAAADyjo74TCLyPB/zMRf0d3L2Qzv0gAT5QRL4nAr6Qh/5Qhf7VST9aST77IrxXQz78bDuIwbxSxT5QB75txX2SCD6PRbvKgr5UyfrHw37ZlD5RTD9zSPvMAj2UyHvXh7wLhL8Tzn0QS/vfRDzlyn3WlLvEAD/nEb9/ND+8Xf/11b/u0b/qUT/ijr/XDf+oRH9Rgn9/Nz8+73+8oz+7lz/5lP/3VL/ykz/fEn/wEf/lkf/ikT/zUP/lED/bTz+4Tv+ejD/li3/sSv/cyn8YCP/wx3/Rhz9Ygv1TQJ4DU1ZAAAAJ3RSTlMABrxiSxcN/vz7+vrx7tbWw7W0q6qnl5OKiomFhIR1X1NRRz8sHxDY9z0GAAAAfElEQVQI12MAAwkWBhhgY9JDcMTsrIVVGVjBbEZuXXULUQYpCIdDV92Kh0GREchWYuay1dZxYZVmA3LE3fTUzS0dmHiZgRxBA0dtLS0dZ3dZIEfSwMnMWNNG30MByFHjd9XUMDLVFwKbJs9pYqhhzy4HsVRFRoBPRBnIAAALzgw1Ol6phQAAAABJRU5ErkJggg==')
    no-repeat;
`;

const Hint = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

export default class SendPoints extends PureComponent {
  static propTypes = {
    communPoint: PropTypes.object,
    sendingPoint: pointType.isRequired,
    selectedUser: PropTypes.shape({}),
    points: PropTypes.instanceOf(Map),
    isLoading: PropTypes.bool.isRequired,

    transfer: PropTypes.func.isRequired,
    waitTransactionAndCheckBalance: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedUser: undefined,
    points: new Map(),
    communPoint: {},
  };

  state = {
    sendingPoint: this.props.sendingPoint,
    sendAmount: '',
    amountError: null,
    selectedUser: this.props.selectedUser,
    isTransactionStarted: false,
  };

  isSelectRecipientOpened = false;

  renderPointCarousel = () => {
    const { points, communPoint } = this.props;
    const { sendingPoint } = this.state;

    const pointsList = [communPoint, ...Array.from(points.values())];
    const pointIndex = pointsList.findIndex(point => point.symbol === sendingPoint.symbol);

    return (
      <CurrencyCarousel
        cmnWithLightBackground
        currencies={pointsList}
        activeIndex={pointIndex}
        onSelect={this.onSelectPoint}
      />
    );
  };

  onSelectPoint = sendingPoint => {
    this.setState({
      sendingPoint,
    });
  };

  renderUserItem = () => {
    const { selectedUser } = this.state;

    const openModal = (
      <Open>
        <DropDownIcon />
      </Open>
    );

    if (!selectedUser) {
      return (
        <>
          <AvatarWrapper>
            <Avatar />
          </AvatarWrapper>
          <UserName>
            <SubTitle>To</SubTitle>
            <Title>Select user</Title>
          </UserName>
          {openModal}
        </>
      );
    }

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
  };

  onSelectClickHandler = async () => {
    const { openModalSelectRecipient } = this.props;

    if (!this.isSelectRecipientOpened) {
      this.isSelectRecipientOpened = true;

      const result = await openModalSelectRecipient();

      if (result) {
        const { selectedUser } = result;
        this.setState({
          selectedUser,
        });
      }

      this.isSelectRecipientOpened = false;
    }
  };

  onSelectKeydownHandler = async e => {
    const code = e.which || e.keyCode;

    if (code !== KEY_CODES.ENTER) {
      return;
    }

    await this.onSelectClickHandler();
  };

  amountInputChangeHandler = e => {
    const { sendingPoint } = this.state;

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
            onKeyDown={this.onSelectKeydownHandler}
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
          {isLoading || isTransactionStarted ? <SplashLoader /> : null}
          {isError && <Error>{amountError}</Error>}
        </InputGroup>
        <Hint>This transaction may take some time</Hint>
      </>
    );
  };

  sendPoints = async () => {
    const { transfer, waitTransactionAndCheckBalance, close } = this.props;
    const { sendingPoint, selectedUser, sendAmount } = this.state;

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
    const { sendingPoint } = this.state;
    const { sendAmount, selectedUser, amountError, isTransactionStarted } = this.state;

    const submitButtonText = (
      <>
        Send: {sendAmount} {sendingPoint.name}
        {sendingPoint.symbol !== COMMUN_SYMBOL ? (
          <FeeLine>
            <FeeText>{calculateFee(sendingPoint)}% will be burned</FeeText>
            <FireIcon />
          </FeeLine>
        ) : null}
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
