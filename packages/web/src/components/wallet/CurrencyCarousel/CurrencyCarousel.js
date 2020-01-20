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

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class CurrencyCarousel extends PureComponent {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.object),
    currencyType: PropTypes.oneOf(Object.keys(CURRENCY_TYPE)),
    activeIndex: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currencies: [],
    currencyType: CURRENCY_TYPE.POINT,
  };

  handleSelectToken = currency => () => {
    const { onSelect } = this.props;

    onSelect({
      ...currency,
      name: currency.name,
    });
  };

  renderItems() {
    const { currencies, currencyType } = this.props;
    return currencies.map(
      (currency, index) =>
        currencyType === CURRENCY_TYPE.POINT ? (
          <Item key={currency.name} onClick={this.handleSelectToken(currency, index)}>
            <PointAvatar point={currency} withBorder />
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
