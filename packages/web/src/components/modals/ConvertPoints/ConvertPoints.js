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
  styles,
  KEY_CODES,
} from '@commun/ui';
import { Icon } from '@commun/icons';
import { checkPressedKey } from 'utils/keyPress';
import { parsePoints } from 'utils/validatingInputs';
import { displayError } from 'utils/toastsMessages';
import { MODAL_CANCEL } from 'store/constants/modalTypes';

import Avatar from 'components/Avatar';

import { Wrapper, Title, CloseButton, CrossIcon, Subtitle } from './tokenActionsComponents';

export const DEFAULT_TOKEN = 'COMMUN';
// TODO replace with a real rate
const TOKEN_RATE = 15;

const ReceiveSubtitle = styled(Subtitle)`
  position: relative;
  padding: 24px 0 12px;
`;

const ConvertIcon = styled(Icon)`
  position: absolute;
  top: 17px;
  left: 50%;
  width: 16px;
  height: 20px;
  color: ${({ theme }) => theme.colors.contextBlue};
  transform: translateX(-50%);
`;

const SubmitWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Submit = styled.button`
  flex-grow: 1;

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
  bottom: 56px;
  display: flex;
  align-items: center;
  height: 27px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.errorTextRed};
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

const WrappedInputWithDropdown = styled(InputWithDropdown)`
  border-radius: 8px 8px 0 0;
`;

const ObtainedPointsQuantity = styled.div`
  width: 100%;
  margin-top: 4px;
  padding: 15px 16px;
  line-height: 20px;
  font-size: 15px;
  letter-spacing: -0.41px;
  border-radius: 0 0 8px 8px;
  background-color: ${({ theme }) => theme.colors.contextWhite};
`;

const ExchangeRate = styled.p`
  margin: 22px 0;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default class ConvertPoints extends Component {
  static propTypes = {
    points: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        communityId: PropTypes.string,
        balance: PropTypes.number.isRequired,
      })
    ),
    obtainedPoints: PropTypes.arrayOf(PropTypes.shape({})),
    selectedPoint: PropTypes.shape({
      name: PropTypes.string.isRequired,
      communityId: PropTypes.string,
      balance: PropTypes.number.isRequired,
    }),
    isLoading: PropTypes.bool.isRequired,

    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    obtainedPoints: [],
    selectedPoint: null,
  };

  state = {
    isPointsOpen: false,
    pointsQuantity: '',
    // eslint-disable-next-line react/destructuring-assignment
    selectedPoint: this.props.selectedPoint,
    selectedObtainedPoint: DEFAULT_TOKEN,
    realObtainedPoint: DEFAULT_TOKEN,
    pointsError: '',
    pointsQuantityError: '',
  };

  componentDidMount() {
    const { close, points } = this.props;
    if (close && !points?.length) {
      close({ status: MODAL_CANCEL });
      ToastsManager.error('Wallet is empty!');
    }
  }

  renderPointsItem = ({ name, communityId, balance }, itemClickHandler = null, isValue = false) => (
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
        <PointAvatar communityId={communityId} />
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

  pointsSelectHandler = item => {
    this.setState({
      selectedPoint: item,
      isPointsOpen: false,
      pointsError: '',
    });
  };

  convertPoints = async () => {
    const { selectedObtainedPoint, selectedPoint, pointsQuantity } = this.state;

    if (selectedObtainedPoint === selectedPoint?.name) {
      this.setState({ pointsError: 'Выберете другой токен' });
      return;
    }
    const { /* value, */ error } = parsePoints(pointsQuantity, selectedPoint?.balance);

    if (error) {
      this.setState({ pointsQuantityError: error });
    }
    // TODO: finish with all convert operations and uncomment
    try {
      /*
        const { processed } = await convertTokens();
      */
    } catch (err) {
      displayError('Convert is failed', err);
    }
  };

  onInputKeyPress = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.convertPoints();
    }
  };

  obtainedInputChangeHandler = selectedObtainedPoint => {
    this.setState({
      selectedObtainedPoint,
      pointsError: '',
    });
  };

  selectObtainedHandler = selectedObtainedPoint => {
    this.setState({
      selectedObtainedPoint,
      realObtainedPoint: selectedObtainedPoint,
    });
  };

  pointsInputChangeHandler = e => {
    this.setState({
      pointsQuantity: e.target.value.replace(/,/g, '.').replace(/[^\d.]+/g, ''),
      pointsQuantityError: '',
    });
  };

  closeModal = () => {
    const { close } = this.props;
    close({ status: MODAL_CANCEL });
  };

  countObtainedPoints() {
    const { pointsQuantity } = this.state;
    let showPoints = pointsQuantity * TOKEN_RATE;
    // eslint-disable-next-line no-self-compare
    if (showPoints !== showPoints) {
      showPoints = 0;
    }
    return showPoints;
  }

  render() {
    const { points, obtainedPoints, isLoading } = this.props;
    const {
      selectedObtainedPoint,
      isPointsOpen,
      selectedPoint,
      pointsQuantity,
      realObtainedPoint,
      pointsError,
      pointsQuantityError,
    } = this.state;

    if (!points.length) {
      return null;
    }

    const filteredPoints = selectedPoint
      ? points.filter(point => point.name !== selectedPoint.name)
      : points;

    return (
      <Wrapper>
        {isLoading && <CircleLoader />}
        <Title>
          Convert points{' '}
          <CloseButton onClick={this.closeModal}>
            <CrossIcon />
          </CloseButton>
        </Title>
        <Subtitle>Pay with</Subtitle>
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
            min={0}
            max={selectedPoint ? selectedPoint.balance : null}
            value={pointsQuantity}
            onChange={this.pointsInputChangeHandler}
          />
        </LabelStyled>
        <ReceiveSubtitle>
          Receive
          <ConvertIcon name="transfer-points" />
        </ReceiveSubtitle>
        <WrappedInputWithDropdown
          isRightNumber
          inputValue={selectedObtainedPoint}
          placeholder="Point"
          title="Point`s name"
          entities={obtainedPoints}
          keyPressHandler={this.onInputKeyPress}
          changeInputHandler={this.obtainedInputChangeHandler}
          selectValueHandler={this.selectObtainedHandler}
        />
        <ObtainedPointsQuantity>{this.countObtainedPoints()}</ObtainedPointsQuantity>
        <ExchangeRate>
          rate: 1 {selectedPoint?.name}/ = {TOKEN_RATE} {realObtainedPoint}
        </ExchangeRate>
        <SubmitWrapper>
          <Error>{pointsError || pointsQuantityError || null}</Error>
          <Submit name="convert-points__convert" type="button" onClick={this.convertPoints}>
            Convert
          </Submit>
        </SubmitWrapper>
      </Wrapper>
    );
  }
}
