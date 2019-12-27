/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TokenAvatar from 'components/wallet/TokenAvatar/TokenAvatar';
import Carousel from 'components/modals/transfers/ExchangeCommun/common/Carousel';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class TokensCarousel extends PureComponent {
  static propTypes = {
    tokens: PropTypes.arrayOf(PropTypes.object),
    activeIndex: PropTypes.number.isRequired,
    onSelectToken: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tokens: [],
  };

  handleSelectToken = token => () => {
    const { onSelectToken } = this.props;

    onSelectToken({ ...token, name: token.name.toUpperCase() });
  };

  renderItems() {
    const { tokens } = this.props;

    return tokens.map((token, index) => (
      <Item key={token.name} onClick={this.handleSelectToken(token, index)}>
        <TokenAvatar name={token.name} fallbackImageUrl={token.image} fluid />
      </Item>
    ));
  }

  render() {
    const { tokens, activeIndex } = this.props;

    if (!tokens.length) {
      return null;
    }

    return (
      <Wrapper>
        <Carousel items={this.renderItems()} active={activeIndex} />
      </Wrapper>
    );
  }
}
