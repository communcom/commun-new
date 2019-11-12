import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Avatar, Dropdown, InvisibleText, List, CircleLoader, styles, KEY_CODES } from '@commun/ui';
import { Icon } from '@commun/icons';

import { POINT_CONVERT_TYPE } from 'shared/constants';

import { pointType, pointsArrayType } from 'types/common';
import { checkPressedKey } from 'utils/keyPress';

import { Wrapper, Title, CloseButton, CrossIcon, Subtitle } from './tokenActionsComponents';

export const DEFAULT_TOKEN = 'COMMUN';

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
  color: ${({ theme }) => theme.colors.blue};
  transform: translateX(-50%);
`;

const SubmitWrapper = styled.div`
  position: relative;
  display: flex;

  margin-top: 10px;
`;

const Submit = styled.button`
  flex-grow: 1;

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

const SellingPoint = styled.div`
  display: flex;

  margin-bottom: 8px;
  padding: 0 16px;

  align-items: center;
  min-height: 46px;
  cursor: default;
  outline: none;

  border-radius: 8px 8px 0 0;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
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

/**
 * TODO refactoring
 */

export default class ConvertPoints extends Component {
  static propTypes = {
    convertType: PropTypes.oneOf(Object.keys(POINT_CONVERT_TYPE)).isRequired,
    points: pointsArrayType,
    sellingPoint: pointType,
    communPoint: pointType.isRequired,
    isLoading: PropTypes.bool.isRequired,

    transfer: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    sellingPoint: null,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    selectedPoint: this.props.sellingPoint,
    pointsError: '',
    pointsQuantityError: '',
    isTransactionStarted: false,
  };

  componentDidMount() {
    const { close, points } = this.props;
    if (close && !points?.length) {
      close();
    }
  }

  renderPointIcon = (symbol, logo) => {
    if (logo) {
      return <PointAvatar avatarUrl={logo} />;
    }

    // FIXME
    return symbol === DEFAULT_TOKEN ? (
      <IconWrapper>
        <CommunIcon name="slash" />
      </IconWrapper>
    ) : (
      <Icon name="dropdown" />
    );
  };

  renderPointsItem = ({ symbol, logo, balance }, itemClickHandler = null, isValue = false) => (
    <ListItem
      key={symbol}
      tabIndex={isValue ? -1 : 0}
      isValue={isValue}
      onClick={isValue ? null : itemClickHandler}
      onKeyDown={isValue ? null : e => this.enterKeyDownHandler(e, itemClickHandler)}
    >
      {this.renderPointIcon(symbol, logo)}
      <ItemName>{symbol}</ItemName>
      <PointsNumber>{balance}</PointsNumber>
    </ListItem>
  );

  renderPoint = ({ symbol, logo, balance }) => (
    <SellingPoint>
      {this.renderPointIcon(symbol, logo)}
      <ItemName>{symbol}</ItemName>
      <PointsNumber>{balance}</PointsNumber>
    </SellingPoint>
  );

  renderPointsList = (items, itemClickHandler) =>
    items.map(item => this.renderPointsItem(item, itemClickHandler(item)));

  renderValue = selectedPoint => () => {
    if (selectedPoint && selectedPoint.symbol !== DEFAULT_TOKEN) {
      return <List>{this.renderPointsItem(selectedPoint, null, true)}</List>;
    }

    return <List>{this.renderPointsItem({ symbol: 'Point' }, null, true)}</List>;
  };

  renderPointsDropdown = () => {
    const { points } = this.props;
    const { selectedPoint } = this.state;

    return (
      <DropdownStyled
        noCheckmark
        noBorder
        value={selectedPoint?.value}
        items={points}
        valueField="symbol"
        listItemRenderer={this.renderPointsList}
        valueRenderer={this.renderValue(selectedPoint)}
        onSelect={this.pointsSelectHandler}
      />
    );
  };

  getComponentsByConvertType = () => {
    const { convertType, communPoint } = this.props;

    const pointComponent = this.renderPoint(communPoint);
    const pointsDropdown = this.renderPointsDropdown();

    if (convertType === POINT_CONVERT_TYPE.BUY) {
      return [pointComponent, pointsDropdown];
    }

    return [pointsDropdown, pointComponent];
  };

  pointsSelectHandler = (value, item) => {
    this.setState({
      selectedPoint: item,
      pointsError: '',
    });
  };

  convertPoints = async () => {
    const { convertType, transfer, close } = this.props;
    const { selectedPoint, pointsQuantity } = this.state;

    this.setState({
      isTransactionStarted: true,
    });

    if (convertType === POINT_CONVERT_TYPE.BUY) {
      await transfer('c.point', pointsQuantity, 'COMMUN', 4, `${selectedPoint.symbol}`);
    } else {
      const value = pointsQuantity;
      const { symbol, decs } = selectedPoint;
      await transfer(
        'c.point',
        value,
        symbol,
        decs,
        `${parseFloat(value).toFixed(decs)} ${symbol}`
      );
    }

    this.setState({
      isTransactionStarted: false,
    });

    close();
  };

  onInputKeyPress = e => {
    if (checkPressedKey(e) === KEY_CODES.ENTER) {
      this.convertPoints();
    }
  };

  pointsInputChangeHandler = e => {
    this.setState({
      pointsQuantity: e.target.value.replace(/,/g, '.').replace(/[^\d.]+/g, ''),
      pointsQuantityError: '',
    });
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { sellingPoint, isLoading } = this.props;
    const { pointsQuantity, pointsError, pointsQuantityError, isTransactionStarted } = this.state;

    const [sellingComponent, buyingComponent] = this.getComponentsByConvertType();

    return (
      <Wrapper>
        {isLoading || isTransactionStarted ? <CircleLoader /> : null}
        <Title>
          Convert points{' '}
          <CloseButton onClick={this.closeModal}>
            <CrossIcon />
          </CloseButton>
        </Title>
        <Subtitle>Pay with</Subtitle>
        {sellingComponent}
        <LabelStyled>
          <InvisibleText>Points number</InvisibleText>
          <Input
            placeholder="Points number"
            min={0}
            max={sellingPoint ? sellingPoint.balance : null}
            value={pointsQuantity}
            onChange={this.pointsInputChangeHandler}
          />
        </LabelStyled>
        <ReceiveSubtitle>
          Receive
          <ConvertIcon name="transfer-points" />
        </ReceiveSubtitle>
        {buyingComponent}
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
