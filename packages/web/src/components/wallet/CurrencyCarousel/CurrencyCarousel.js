/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CURRENCY_TYPE } from 'shared/constants';

import PointAvatar from '../PointAvatar';
import Carousel from './Carousel';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Item = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class CurrencyCarousel extends PureComponent {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.object),
    currencyType: PropTypes.oneOf(Object.keys(CURRENCY_TYPE)),
    activeIndex: PropTypes.number.isRequired,
    cmnWithLightBackground: PropTypes.bool,

    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currencies: [],
    currencyType: CURRENCY_TYPE.POINT,
    cmnWithLightBackground: false,
  };

  handleSelectToken = currency => () => {
    const { onSelect } = this.props;

    onSelect({
      ...currency,
      name: currency.name,
    });
  };

  renderItems() {
    const { currencies, currencyType, cmnWithLightBackground } = this.props;
    return currencies.map(
      (currency, index) =>
        currencyType === CURRENCY_TYPE.POINT ? (
          <Item
            key={currency.name}
            name={`currencies-carousel__${currency.name}`}
            onClick={this.handleSelectToken(currency, index)}
          >
            <PointAvatar
              point={currency}
              withBorder
              cmnWithLightBackground={cmnWithLightBackground}
            />
          </Item>
        ) : null // CURRENCY_TYPE.COIN implement if needed
    );
  }

  render() {
    const { currencies, activeIndex } = this.props;

    if (!currencies.length) {
      return null;
    }

    return (
      <Wrapper>
        <Carousel items={this.renderItems()} active={activeIndex} />
      </Wrapper>
    );
  }
}
