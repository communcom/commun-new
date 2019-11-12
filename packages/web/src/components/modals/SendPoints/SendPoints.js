import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import {
  Dropdown,
  InvisibleText,
  InputWithDropdown,
  List,
  CircleLoader,
  Avatar,
  styles,
  KEY_CODES,
} from '@commun/ui';
import { Icon } from '@commun/icons';

import { pointType, pointsArrayType } from 'types/common';
import { checkPressedKey } from 'utils/keyPress';
import { parsePoints } from 'utils/validatingInputs';
import { displayError } from 'utils/toastsMessages';

import {
  Wrapper,
  Title,
  CloseButton,
  CrossIcon,
  Subtitle,
} from 'components/modals/ConvertPoints/tokenActionsComponents';

export const DEFAULT_TOKEN = 'COMMUN';

const ToSubtitle = styled(Subtitle)`
  padding: 0 0 12px;
`;

const Label = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 15px 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Input = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 15px 16px;
  line-height: 20px;
  font-size: 15px;
  background-color: transparent;
  color: #000;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }

  &:focus::placeholder,
  &:active::placeholder {
    opacity: 0;
  }
`;

const LabelStyled = styled(Label)`
  margin-bottom: 27px;
  border-radius: 0 0 8px 8px;

  &::after {
    position: absolute;
    top: 0;
    right: 16px;
    content: '';
    display: block;
    width: 20px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }
`;

const SubmitWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Submit = styled.button`
  flex-grow: 1;
  margin-top: 56px;

  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 8px;
  padding: 18px;

  line-height: 20px;
  font-size: 17px;
  text-align: center;

  color: #fff;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0 16px;
  min-height: 46px;
  cursor: pointer;
  outline: none;

  &:hover p,
  &:focus p {
    color: ${({ theme }) => theme.colors.blue};
  }

  ${is('isValue')`
    border-radius: 8px 8px 0 0;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `};
`;

const PointAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
`;

const ItemName = styled.p`
  margin-left: 16px;
  line-height: 20px;
  font-size: 15px;
  ${styles.overflowEllipsis};
  transition: color 0.15s;
`;

const PointsNumber = styled.p`
  margin-left: auto;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.15s;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const CommunIcon = styled(Icon)`
  width: 4px;
  height: 9px;
`;

const DropdownStyled = styled(Dropdown)`
  margin-bottom: 4px;
`;

const Error = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  height: 27px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.errorTextRed};
`;

export default class SendPoints extends Component {
  static propTypes = {
    points: pointsArrayType,
    users: PropTypes.arrayOf(PropTypes.shape({})),
    selectedPoint: pointType,
    userId: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,

    transfer: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    users: [],
    selectedPoint: null,
    userId: null,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    selectedPoint: this.props.selectedPoint,
    pointsNumber: '',
    // eslint-disable-next-line react/destructuring-assignment
    recipient: this.props.userId ? this.props.userId : '',
    pointsError: '',
    recipientError: '',
    isTransactionStarted: false,
  };

  componentDidMount() {
    const { close, points } = this.props;
    if (close && !points?.length) {
      close();
      displayError('Wallet is empty!');
    }
  }

  enterKeyDownHandler = (e, cb) => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      cb();
    }
  };

  pointsSelectHandler = item => {
    this.setState({ selectedPoint: item });
  };

  pointsInputChangeHandler = e => {
    this.setState({
      pointsNumber: e.target.value.replace(/,/g, '.').replace(/[^\d.]+/g, ''),
      pointsError: '',
    });
  };

  recipientInputChangeHandler = recipient => {
    this.setState({
      recipient,
      recipientError: '',
    });
  };

  selectRecipientHandler = recipient => {
    this.setState({
      recipient,
    });
  };

  renderPointsItem = ({ symbol, logo, balance }, itemClickHandler = null, isValue = false) => (
    <ListItem
      key={symbol}
      tabIndex={isValue ? -1 : 0}
      isValue={isValue}
      onClick={isValue ? null : itemClickHandler}
      onKeyDown={isValue ? null : e => this.enterKeyDownHandler(e, itemClickHandler)}
    >
      {symbol === DEFAULT_TOKEN ? (
        <IconWrapper>
          <CommunIcon name="slash" />
        </IconWrapper>
      ) : (
        <PointAvatar avatarUrl={logo} />
      )}
      <ItemName>{symbol}</ItemName>
      <PointsNumber>{balance}</PointsNumber>
    </ListItem>
  );

  renderPointsList = (items, itemClickHandler) =>
    items.map(item => this.renderPointsItem(item, itemClickHandler(item)));

  renderValue = () => {
    const { selectedPoint } = this.state;

    if (selectedPoint) {
      return <List>{this.renderPointsItem(selectedPoint, null, true)}</List>;
    }
    return null;
  };

  sendPoints = async () => {
    const { transfer, close } = this.props;
    const { recipient, selectedPoint, pointsNumber } = this.state;

    const { balance, decs, symbol } = selectedPoint;
    const { value, error } = parsePoints(pointsNumber, balance);

    if (error) {
      this.setState({ pointsError: error });
      return;
    }
    if (!recipient) {
      this.setState({ recipientError: 'Enter the recipient name' });
      return;
    }
    this.setState({
      isTransactionStarted: true,
    });

    await transfer(recipient, value, symbol, decs);

    this.setState({
      isTransactionStarted: false,
    });
    close();
  };

  onInputKeyPress = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.sendPoints();
    }
  };

  closeModal = () => {
    const { close } = this.props;
    if (close) {
      close();
    }
  };

  render() {
    const { points, users, isLoading } = this.props;
    const {
      selectedPoint,
      pointsNumber,
      recipient,
      pointsError,
      recipientError,
      isTransactionStarted,
    } = this.state;

    if (!points.length) {
      return null;
    }

    const filteredPoints = selectedPoint
      ? points.filter(point => point.name !== selectedPoint.name)
      : points;

    return (
      <Wrapper>
        {isLoading || isTransactionStarted ? <CircleLoader /> : null}
        <Title>
          Send points{' '}
          <CloseButton onClick={this.closeModal}>
            <CrossIcon />
          </CloseButton>
        </Title>
        <Subtitle>Amount</Subtitle>
        <DropdownStyled
          noCheckmark
          noBorder
          items={filteredPoints}
          listItemRenderer={this.renderPointsList}
          valueRenderer={this.renderValue}
          onSelect={this.pointsSelectHandler}
        />
        <LabelStyled>
          <InvisibleText>Points number</InvisibleText>
          <Input
            placeholder="Points number"
            name="send-points__points-number-input"
            min={0}
            max={selectedPoint ? selectedPoint.balance : null}
            value={pointsNumber}
            onChange={this.pointsInputChangeHandler}
          />
        </LabelStyled>
        <ToSubtitle>To</ToSubtitle>
        <InputWithDropdown
          inputValue={recipient}
          placeholder="Username"
          title="Recipient`s username"
          entities={users}
          keyPressHandler={this.onInputKeyPress}
          changeInputHandler={this.recipientInputChangeHandler}
          selectValueHandler={this.selectRecipientHandler}
        />
        <SubmitWrapper>
          <Error>{pointsError || recipientError || null}</Error>
          <Submit type="button" name="send-points__submit-sending" onClick={this.sendPoints}>
            Send
          </Submit>
        </SubmitWrapper>
      </Wrapper>
    );
  }
}
