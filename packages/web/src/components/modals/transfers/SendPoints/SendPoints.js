import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Avatar, CircleLoader } from '@commun/ui';

import { pointType } from 'types/common';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import { InputStyled, HeaderCommunLogo, ButtonStyled, InputGroup } from '../common.styled';
import BasicTransferModal from '../BasicTransferModal';

const UserItemWrapper = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 10px;
  padding: 12px;

  width: 100%;

  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 10px;
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

// TODO wip
export default class SendPoints extends PureComponent {
  static propTypes = {
    communPoint: pointType.isRequired,
    sendingPoint: pointType,
    isLoading: PropTypes.bool.isRequired,

    transfer: PropTypes.func.isRequired,
    waitTransactionAndCheckBalance: PropTypes.func.isRequired,
    openModalSelectRecipient: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sendingPoint: null,
  };

  state = {
    sendAmount: '',
    selectedUser: null,
    isTransactionStarted: false,
  };

  getSendPointInfo = () => {
    const { communPoint, sendingPoint } = this.props;

    if (sendingPoint) {
      return {
        pointName: sendingPoint.name,
        pointBalance: sendingPoint.balance,
      };
    }

    return {
      pointName: 'Commun',
      pointBalance: communPoint.balance,
    };
  };

  renderPointCarousel = () => {
    const { sendingPoint } = this.props;

    if (sendingPoint) {
      return <Avatar avatarUrl={sendingPoint.logo} size="large" name={sendingPoint.name} />;
    }

    return <HeaderCommunLogo />;
  };

  renderUserItem = () => {
    const { selectedUser } = this.state;

    const openModal = (
      <Open onClick={this.onSelectClickHandler}>
        <DropDownIcon />
      </Open>
    );

    if (selectedUser) {
      return (
        <>
          <AvatarWrapper>
            {/* TODO
            <Avatar avatarUrl={selectedUser.avatarUrl} name={selectedUser.username} />
             */}
          </AvatarWrapper>
          <UserName>
            <SubTitle>To</SubTitle>
            <Title>{/* selectedUser.username */ selectedUser}</Title>
          </UserName>
          {openModal}
        </>
      );
    }
    return (
      <>
        <AvatarWrapper>
          <span role="img" aria-label="">
            🐨 {/* TODO move to public/images as image */}
          </span>
        </AvatarWrapper>
        <UserName>
          <SubTitle>To</SubTitle>
          <Title>Username</Title>
        </UserName>
        {openModal}
      </>
    );
  };

  onSelectClickHandler = async () => {
    const { openModalSelectRecipient } = this.props;
    const result = await openModalSelectRecipient();

    if (result) {
      const selectedUser = result.selectedItem;
      this.setState({
        selectedUser,
      });
    }
  };

  amountInputChangeHandler = e => {
    const { value } = e.target;

    this.setState({
      sendAmount: value,
    });
  };

  renderBody = () => {
    const { isLoading } = this.props;
    const { sendAmount, isTransactionStarted } = this.state;

    return (
      <InputGroup>
        <UserItemWrapper>{this.renderUserItem()}</UserItemWrapper>
        <InputStyled
          fluid
          title="Amount"
          value={sendAmount}
          onChange={this.amountInputChangeHandler}
        />
        {isLoading || (isTransactionStarted && <CircleLoader />)}
      </InputGroup>
    );
  };

  renderFooter = () => {
    const { sendAmount } = this.state;

    const { pointName } = this.getSendPointInfo();

    return (
      <ButtonStyled primary fluid onClick={this.sendPoints}>
        Send: {sendAmount} {pointName} <Fee>{/* Commission: 0,1% */}</Fee>
      </ButtonStyled>
    );
  };

  sendPoints = async () => {
    const { transfer, waitTransactionAndCheckBalance, close } = this.props;
    const { selectedUser, sendAmount } = this.state;

    this.setState({
      isTransactionStarted: true,
    });

    let trxId;
    try {
      const trx = await transfer(/* TODO selectedUser.userId */ selectedUser, sendAmount, 'CMN');
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
    const { pointName, pointBalance } = this.getSendPointInfo();

    return (
      <BasicTransferModal
        title="Send"
        pointName={pointName}
        pointBalance={pointBalance}
        pointCarouselRenderer={this.renderPointCarousel}
        body={this.renderBody()}
        footer={this.renderFooter()}
        close={this.closeModal}
      />
    );
  }
}
