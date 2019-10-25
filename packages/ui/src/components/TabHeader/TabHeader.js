import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TitleWrapper = styled.div``;

const Title = styled.h2`
  display: inline-block;
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  vertical-align: baseline;
`;

function TabHeader({ title, quantity }) {
  return (
    <TitleWrapper>
      <Title>
        {quantity} {title}
      </Title>
    </TitleWrapper>
  );
}

TabHeader.propTypes = {
  title: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default memo(TabHeader);
