/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Avatar, CircleLoader } from '@commun/ui';

import { POINT_CONVERT_TYPE } from 'shared/constants';
import { pointType } from 'types/common';
import { displayError, displaySuccess } from 'utils/toastsMessages';

import {
  InputStyled,
  HeaderCommunLogo,
  ButtonStyled,
  RateInfo,
  InputGroup,
} from '../common.styled';
import BuyPointItem from '../BuyPointItem';
import BasicTransferModal from '../BasicTransferModal';

const AmountGroup = styled.div`
  display: flex;

  margin-bottom: 20px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const Fee = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};

  opacity: 0.7;
`;

const PRICE_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL',
  RATE: 'RATE',
};

const RATE_POINTS_AMOUNT = 10;
const PRICE_FETCH_DELAY = 100;

export default class ConvertPoints extends PureComponent {
  static propTypes = {
    convertType: PropTypes.oneOf(Object.keys(POINT_CONVERT_TYPE)).isRequired,
    points: PropTypes.instanceOf(Map),
    convetPoints: PropTypes.shape({
      sellingPoint: pointType,
      buyingPoint: pointType,
    }).isRequired,
    communPoint: pointType.isRequired,
    isLoading: PropTypes.bool.isRequired,

    convert: PropTypes.func.isRequired,
    waitTransactionAndCheckBalance: PropTypes.func.isRequired,
    getSellPrice: PropTypes.func.isRequired,
    getBuyPrice: PropTypes.func.isRequired,
    openModalSelectPoint: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: new Map(),
  };

  state = {
    sellAmount: '',
    buyAmount: '',
    convertType: this.props.convertType,
    sellingPoint: this.props.convetPoints.sellingPoint,
    buyingPoint: this.props.convetPoints.buyingPoint,
    rate: '',
  };

  componentDidMount() {
    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.RATE);
    }, PRICE_FETCH_DELAY);
  }

  // TODO implement
  renderPointCarousel = () => {
    const { convertType, sellingPoint } = this.state;

    if (convertType === POINT_CONVERT_TYPE.BUY) {
      return <HeaderCommunLogo />;
    }

    return <Avatar avatarUrl={sellingPoint.logo} size="large" />;
  };

  swapClickHandler = () => {
    const { buyingPoint } = this.state;

    if (!buyingPoint) {
      return;
    }

    this.setState(state => ({
      convertType:
        state.convertType === POINT_CONVERT_TYPE.BUY
          ? POINT_CONVERT_TYPE.SELL
          : POINT_CONVERT_TYPE.BUY,
      buyingPoint: state.sellingPoint,
      sellingPoint: state.buyingPoint,
      sellAmount: state.buyAmount,
      buyAmount: state.sellAmount,
    }));
  };

  buyPointItemClickHandler = async () => {
    const { openModalSelectPoint, points } = this.props;
    const result = await openModalSelectPoint({ points });

    if (result) {
      const buyingPoint = points.get(result.selectedItem);

      this.setState({
        buyingPoint,
      });
    }

    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.RATE);
    }, PRICE_FETCH_DELAY);
  };

  sellInputChangeHandler = e => {
    const { value } = e.target;

    this.setState({
      sellAmount: value,
    });

    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.SELL);
    }, PRICE_FETCH_DELAY);
  };

  buyInputChangeHandler = e => {
    const { value } = e.target;

    this.setState({
      buyAmount: value,
    });

    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.BUY);
    }, PRICE_FETCH_DELAY);
  };

  getAmount = result => {
    if (!result) {
      return '';
    }

    const [amount] = result.price.split(' ');

    return amount;
  };

  calculatePrice = async priceType => {
    const { getSellPrice, getBuyPrice } = this.props;
    const { convertType, sellAmount, buyAmount, buyingPoint, sellingPoint } = this.state;

    if (!buyingPoint) {
      return;
    }

    if (convertType === POINT_CONVERT_TYPE.BUY) {
      if (priceType === PRICE_TYPE.SELL) {
        this.setState({
          buyAmount: this.getAmount(
            await getBuyPrice(buyingPoint.symbol, `${sellAmount} ${sellingPoint.symbol}`)
          ),
        });
      } else if (priceType === PRICE_TYPE.BUY) {
        this.setState({
          sellAmount: this.getAmount(await getSellPrice(`${buyAmount} ${buyingPoint.symbol}`)),
        });
      } else {
        this.setState({
          rate: this.getAmount(
            await getBuyPrice(buyingPoint.symbol, `${RATE_POINTS_AMOUNT} ${sellingPoint.symbol}`)
          ),
        });
      }
    }

    if (convertType === POINT_CONVERT_TYPE.SELL) {
      if (priceType === PRICE_TYPE.SELL) {
        this.setState({
          buyAmount: this.getAmount(await getSellPrice(`${sellAmount} ${sellingPoint.symbol}`)),
        });
      } else if (priceType === PRICE_TYPE.BUY) {
        this.setState({
          sellAmount: this.getAmount(
            await getBuyPrice(sellingPoint.symbol, `${buyAmount} ${buyingPoint.symbol}`)
          ),
        });
      } else {
        this.setState({
          rate: this.getAmount(
            await getBuyPrice(sellingPoint.symbol, `${RATE_POINTS_AMOUNT} ${buyingPoint.symbol}`)
          ),
        });
      }
    }
  };

  renderBuyPointItem = () => {
    const { communPoint } = this.props;
    const { convertType, buyingPoint } = this.state;

    if (convertType === POINT_CONVERT_TYPE.SELL) {
      return <BuyPointItem point={communPoint} />;
    }

    return <BuyPointItem point={buyingPoint} onSelectClick={this.buyPointItemClickHandler} />;
  };

  renderBody = () => {
    const { isLoading } = this.props;
    const {
      convertType,
      sellAmount,
      buyAmount,
      sellingPoint,
      buyingPoint,
      rate,
      isTransactionStarted,
    } = this.state;

    const rateSellAmount = convertType === POINT_CONVERT_TYPE.SELL ? rate : RATE_POINTS_AMOUNT;
    const reteBuyAmmount = convertType === POINT_CONVERT_TYPE.SELL ? RATE_POINTS_AMOUNT : rate;

    const buyPointName = buyingPoint ? buyingPoint.name : '';

    return (
      <InputGroup>
        {this.renderBuyPointItem()}
        <AmountGroup>
          <InputStyled
            title={`Sell ${sellingPoint.name}`}
            value={sellAmount}
            onChange={this.sellInputChangeHandler}
          />
          <InputStyled
            title={`Buy ${buyPointName}`}
            value={buyAmount}
            onChange={this.buyInputChangeHandler}
          />
        </AmountGroup>
        {buyingPoint && (
          <RateInfo>
            Rate: {rateSellAmount} {sellingPoint.name} = {reteBuyAmmount} {buyPointName}
          </RateInfo>
        )}
        {isLoading || (isTransactionStarted && <CircleLoader />)}
      </InputGroup>
    );
  };

  renderFooter = () => {
    const { sellAmount, sellingPoint } = this.state;

    return (
      <ButtonStyled primary fluid onClick={this.convertPoints}>
        Convert: {sellAmount} {sellingPoint.name} <Fee>{/* Commission: 0,1% */}</Fee>
      </ButtonStyled>
    );
  };

  convertPoints = async () => {
    const { waitTransactionAndCheckBalance, convert, close } = this.props;
    const { convertType, buyingPoint, sellingPoint, sellAmount } = this.state;

    this.setState({
      isTransactionStarted: true,
    });

    const { symbol } = convertType === POINT_CONVERT_TYPE.SELL ? sellingPoint : buyingPoint;

    let trxId;
    try {
      const trx = await convert(convertType, sellAmount, symbol);
      trxId = trx?.processed?.id;

      displaySuccess('Convert is successful');
    } catch (err) {
      displayError('Convert is failed');
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
    const { sellingPoint } = this.state;

    return (
      <BasicTransferModal
        title="Convert"
        pointName={sellingPoint.name}
        pointBalance={sellingPoint.balance}
        pointCarouselRenderer={this.renderPointCarousel}
        body={this.renderBody()}
        onSwapClick={this.swapClickHandler}
        footer={this.renderFooter()}
        close={this.closeModal}
      />
    );
  }
}
