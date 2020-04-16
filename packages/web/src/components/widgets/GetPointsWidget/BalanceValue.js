import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles } from '@commun/ui';

import { formatMoney } from 'utils/format';

const Wrapper = styled.div`
  line-height: 1;
  font-size: 28px;
  ${styles.overflowEllipsis}
`;

const Int = styled.span`
  font-weight: bold;
  color: #fff;
  line-height: 1;
`;

const Fract = styled.span`
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
`;

export default function BalanceValue({ value, className }) {
  const [int, fract] = value.split('.');

  return (
    <Wrapper className={className}>
      <Int>{formatMoney(int)}</Int>
      {fract === undefined ? null : <Fract>.{fract}</Fract>}
    </Wrapper>
  );
}

BalanceValue.propTypes = {
  value: PropTypes.string.isRequired,
};
