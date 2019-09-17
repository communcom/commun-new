import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TitleWrapper = styled.div``;

const Title = styled.h2`
  display: inline-block;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: -0.41px;
  line-height: 22px;
  vertical-align: baseline;
`;

const Quantity = styled.span`
  display: inline-block;
  padding-left: 12px;
  font-size: 15px;
  letter-spacing: -0.41px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.contextGrey};
  vertical-align: baseline;
`;

function TabHeader({ title, quantity }) {
  return (
    <TitleWrapper>
      <Title>{title}</Title>
      <Quantity>{quantity}</Quantity>
    </TitleWrapper>
  );
}

TabHeader.propTypes = {
  title: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default memo(TabHeader);
