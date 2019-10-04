import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import ToastsManager from 'toasts-manager';

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
import { checkPressedKey } from 'utils/keyPress';
import { parsePoints } from 'utils/validatingInputs';
import { MODAL_CANCEL } from 'store/constants/modalTypes';

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
  background-color: ${({ theme }) => theme.colors.contextWhite};
`;

const Input = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 15px 16px;
  line-height: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
  background-color: transparent;
  color: #000;

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
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
    background-color: ${({ theme }) => theme.colors.contextWhite};
  }
`;

const SubmitWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Submit = styled.button`
  flex-grow: 1;
  margin-top: 56px;

  background-color: ${({ theme }) => theme.colors.contextBlue};
  border-radius: 8px;
  padding: 18px;

  line-height: 20px;
  font-size: 17px;
  text-align: center;
  letter-spacing: -0.41px;

  color: #fff;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.contextBlueHover};
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
    color: ${({ theme }) => theme.colors.contextBlue};
  }

  ${is('isValue')`
    border-radius: 8px 8px 0 0;
    background-color: ${({ theme }) => theme.colors.contextWhite};
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
  letter-spacing: -0.41px;
  ${styles.overflowEllipsis};
  transition: color 0.15s;
`;

const PointsNumber = styled.p`
  margin-left: auto;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.41px;
  line-height: normal;
  color: ${({ theme }) => theme.colors.contextGrey};
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
  background-color: ${({ theme }) => theme.colors.contextBlue};
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
    points: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        communityId: PropTypes.string,
        balance: PropTypes.number.isRequired,
      })
    ),
    users: PropTypes.arrayOf(PropTypes.shape({})),
    selectedPoint: PropTypes.shape({
      name: PropTypes.string.isRequired,
      communityId: PropTypes.string,
      balance: PropTypes.number.isRequired,
    }),
    userId: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,

    transfer: PropTypes.func.isRequired,
    close: PropTypes.func,
  };

  static defaultProps = {
    points: [],
    users: [],
    selectedPoint: null,
    userId: null,
    close: null,
  };

  state = {
    isPointsOpen: false,
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
      close({ status: MODAL_CANCEL });
      ToastsManager.error('Wallet is empty!');
    }
  }

  enterKeyDownHandler = (e, cb) => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      cb();
    }
  };

  pointsSelectHandler = item => {
    this.setState({ selectedPoint: item, isPointsOpen: false });
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

  renderPointsItem = ({ name, logo, balance }, itemClickHandler = null, isValue = false) => (
    <ListItem
      key={name}
      tabIndex={isValue ? -1 : 0}
      isValue={isValue}
      onClick={isValue ? null : itemClickHandler}
      onKeyDown={isValue ? null : e => this.enterKeyDownHandler(e, itemClickHandler)}
    >
      {name === DEFAULT_TOKEN ? (
        <IconWrapper>
          <CommunIcon name="slash" />
        </IconWrapper>
      ) : (
        <PointAvatar avatarUrl={logo} />
      )}
      <ItemName>{name}</ItemName>
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
    // FIXME
    const result = await transfer(recipient, value, symbol, decs);

    this.setState({
      isTransactionStarted: false,
    });

    if (result && close) {
      close({ status: MODAL_CANCEL });
    }
  };

  onInputKeyPress = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.sendPoints();
    }
  };

  closeModal = () => {
    const { close } = this.props;
    if (close) {
      close({ status: MODAL_CANCEL });
    }
  };

  render() {
    const { points, users, isLoading } = this.props;
    const {
      isPointsOpen,
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
          isOpen={isPointsOpen}
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
