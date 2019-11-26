import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { up } from '@commun/ui';

import { PointInfoPanel } from 'components/wallet/panels';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 550px;
  width: 375px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;

  ${up.mobileLandscape} {
    padding-bottom: 32px;

    width: 330px;

    border-radius: 25px;
  }
`;

export default class PointInfo extends PureComponent {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { symbol } = this.props;
    return (
      <Wrapper>
        <PointInfoPanel symbol={symbol} closeAction={this.closeModal} />
      </Wrapper>
    );
  }
}
