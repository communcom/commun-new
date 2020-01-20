/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CircleLoader } from '@commun/ui';

import { POINT_CONVERT_TYPE } from 'shared/constants';
import { pointType } from 'types/common';
import { displayError, displaySuccess } from 'utils/toastsMessages';
import { validateAmount, sanitizeAmount } from 'utils/validatingInputs';

import CurrencyCarousel from 'components/wallet/CurrencyCarousel';

import { InputStyled, HeaderCommunLogo, RateInfo, InputGroup, Error } from '../common.styled';
import BuyPointItem from '../BuyPointItem';
import BasicTransferModal from '../BasicTransferModal';

const AmountGroup = styled.div`
  display: flex;

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

const ErrorWrapper = styled.div`
  margin-bottom: 5px;

  width: 100%;
  height: 20px;
`;

const PRICE_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL',
  RATE: 'RATE',
};

const AMOUNT_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL',
};

const RATE_POINTS_AMOUNT = 10;
const PRICE_FETCH_DELAY = 100;

export default class ConvertPoints extends PureComponent {
  static propTypes = {
    convertType: PropTypes.oneOf(Object.keys(POINT_CONVERT_TYPE)).isRequired,
    points: PropTypes.instanceOf(Map),
    convetPoints: PropTypes.shape({
      sellingPoint: pointType,
      buyingPoint: PropTypes.oneOfType([pointType, PropTypes.string]),
    }).isRequired,
    communPoint: pointType.isRequired,
    isLoading: PropTypes.bool.isRequired,

    convert: PropTypes.func.isRequired,
    openWallet: PropTypes.func.isRequired,
    openCommunWallet: PropTypes.func.isRequired,
    waitTransactionAndCheckBalance: PropTypes.func.isRequired,
    getSellPrice: PropTypes.func.isRequired,
    getBuyPrice: PropTypes.func.isRequired,
    getPointInfo: PropTypes.func.isRequired,
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
    sellAmountError: null,
    buyAmountError: null,
    needOpenWallet: false,
  };

  async componentDidMount() {
    const { getPointInfo } = this.props;
    const { buyingPoint } = this.state;

    if (typeof buyingPoint === 'string') {
      try {
        const pointInfo = await getPointInfo(buyingPoint);

        this.setState({
          buyingPoint: {
            symbol: pointInfo.symbol,
            name: pointInfo.name,
            logo: pointInfo.logo,
            balance: '0',
          },
          needOpenWallet: true,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    }

    // TODO: refactor
    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.RATE);
    }, PRICE_FETCH_DELAY);
  }

  renderPointCarousel = () => {
    const { points } = this.props;
    const { convertType, sellingPoint } = this.state;

    if (convertType === POINT_CONVERT_TYPE.BUY) {
      return <HeaderCommunLogo />;
    }

    const pointsList = Array.from(points.values());
    const pointIndex = pointsList.findIndex(point => point.symbol === sellingPoint.symbol);

    return (
      <CurrencyCarousel
        currencies={pointsList}
        activeIndex={pointIndex}
        onSelect={this.onSelectPoint}
      />
    );
  };

  onSelectPoint = sellingPoint => {
    this.setState({
      sellingPoint,
    });

    // TODO: refactor
    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.RATE);
    }, PRICE_FETCH_DELAY);
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
      sellAmountError: state.buyAmountError,
      buyAmountError: state.sellAmountError,
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
    let amount = sanitizeAmount(value);

    if (amount === '.') {
      amount = '0.';
    }

    this.setState({
      sellAmount: amount,
      // TODO: refactor
      sellAmountError: this.validateInputAmount(amount, AMOUNT_TYPE.SELL),
    });

    // TODO: refactor
    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.SELL);
    }, PRICE_FETCH_DELAY);
  };

  buyInputChangeHandler = e => {
    const { value } = e.target;
    let amount = sanitizeAmount(value, AMOUNT_TYPE.BUY);

    if (amount === '.') {
      amount = '0.';
    }

    this.setState({
      buyAmount: amount,
      // TODO: refactor
      buyAmountError: this.validateInputAmount(amount),
    });

    // TODO: refactor
    setTimeout(() => {
      this.calculatePrice(PRICE_TYPE.BUY);
    }, PRICE_FETCH_DELAY);
  };

  validateInputAmount = (amount, type) => {
    const { sellingPoint, buyingPoint } = this.state;

    return validateAmount(amount, type === AMOUNT_TYPE.SELL ? sellingPoint : buyingPoint);
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
      switch (priceType) {
        case PRICE_TYPE.SELL:
          if (!sellAmount) {
            return;
          }

          this.setState({
            buyAmount: this.getAmount(
              await getBuyPrice(buyingPoint.symbol, `${sellAmount} ${sellingPoint.symbol}`)
            ),
            buyAmountError: null,
          });
          break;

        case PRICE_TYPE.BUY:
          if (!buyAmount) {
            return;
          }

          this.setState({
            sellAmount: this.getAmount(await getSellPrice(`${buyAmount} ${buyingPoint.symbol}`)),
            sellAmountError: null,
          });
          break;

        default:
          this.setState({
            rate: this.getAmount(
              await getBuyPrice(buyingPoint.symbol, `${RATE_POINTS_AMOUNT} ${sellingPoint.symbol}`)
            ),
          });
          break;
      }
    }

    if (convertType === POINT_CONVERT_TYPE.SELL) {
      switch (priceType) {
        case PRICE_TYPE.SELL:
          if (!sellAmount) {
            return;
          }

          this.setState({
            buyAmount: this.getAmount(await getSellPrice(`${sellAmount} ${sellingPoint.symbol}`)),
            buyAmountError: null,
          });
          break;

        case PRICE_TYPE.BUY:
          if (!buyAmount) {
            return;
          }

          this.setState({
            sellAmount: this.getAmount(
              await getBuyPrice(sellingPoint.symbol, `${buyAmount} ${buyingPoint.symbol}`)
            ),
            sellAmountError: null,
          });
          break;

        default:
          this.setState({
            rate: this.getAmount(
              await getBuyPrice(sellingPoint.symbol, `${RATE_POINTS_AMOUNT} ${buyingPoint.symbol}`)
            ),
          });
          break;
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
      sellAmountError,
      buyAmountError,
      isTransactionStarted,
    } = this.state;

    const rateSellAmount = convertType === POINT_CONVERT_TYPE.SELL ? rate : RATE_POINTS_AMOUNT;
    const rateBuyAmount = convertType === POINT_CONVERT_TYPE.SELL ? RATE_POINTS_AMOUNT : rate;

    const buyPointName = buyingPoint ? buyingPoint.name : '';

    const error = sellAmountError || buyAmountError;

    return (
      <InputGroup>
        {this.renderBuyPointItem()}
        <AmountGroup>
          <InputStyled
            title="You send"
            value={sellAmount}
            isError={Boolean(sellAmountError)}
            disabled={!sellingPoint || !buyingPoint}
            onChange={this.sellInputChangeHandler}
          />
          <InputStyled
            title="You get"
            value={buyAmount}
            isError={Boolean(buyAmountError)}
            disabled={!sellingPoint || !buyingPoint}
            onChange={this.buyInputChangeHandler}
          />
        </AmountGroup>
        <ErrorWrapper>
          <Error>{error}</Error>
        </ErrorWrapper>
        {buyingPoint && (
          <RateInfo>
            Rate: {rateSellAmount} {sellingPoint.name} = {rateBuyAmount} {buyPointName}
          </RateInfo>
        )}
        {isLoading || (isTransactionStarted && <CircleLoader />)}
      </InputGroup>
    );
  };

  convertPoints = async () => {
    const {
      waitTransactionAndCheckBalance,
      convert,
      openWallet,
      communPoint,
      openCommunWallet,
      close,
    } = this.props;
    const { convertType, buyingPoint, sellingPoint, sellAmount, needOpenWallet } = this.state;

    this.setState({
      isTransactionStarted: true,
    });

    const { symbol } = convertType === POINT_CONVERT_TYPE.SELL ? sellingPoint : buyingPoint;

    let trxId;
    try {
      if (communPoint.needOpenBalance) {
        await openCommunWallet();
      }

      if (needOpenWallet) {
        await openWallet(symbol);
      }

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
    const {
      sellingPoint,
      buyingPoint,
      sellAmount,
      buyAmount,
      sellAmountError,
      buyAmountError,
      isTransactionStarted,
    } = this.state;

    const submitButtonText = (
      <>
        Convert: {sellAmount} {sellingPoint.name} <Fee>{/* Commission: 0,1% */}</Fee>
      </>
    );

    return (
      <BasicTransferModal
        title="Convert"
        point={sellingPoint}
        pointCarouselRenderer={this.renderPointCarousel}
        body={this.renderBody()}
        onSwapClick={this.swapClickHandler}
        submitButtonText={submitButtonText}
        onSubmitButtonClick={this.convertPoints}
        isSubmitButtonDisabled={
          !buyingPoint ||
          !sellAmount ||
          !buyAmount ||
          sellAmountError ||
          buyAmountError ||
          isTransactionStarted
        }
        close={this.closeModal}
      />
    );
  }
}
