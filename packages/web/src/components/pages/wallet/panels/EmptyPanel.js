import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 20% 0;
  min-width: 100%;
`;

const Primary = styled.div`
  font-size: 21px;
  font-weight: 600;
`;

const Secondary = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

const ImageWrapper = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
  background-image: url('/images/monkey.png');
  background-size: 32px 32px;
`;

const EmptyPanel = ({ primary, secondary, className }) => (
  <Wrapper className={className}>
    <ImageWrapper />
    <Primary>{primary}</Primary>
    {Boolean(secondary) && <Secondary>{secondary}</Secondary>}
  </Wrapper>
);

EmptyPanel.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string,
};

EmptyPanel.defaultProps = {
  secondary: undefined,
};

export default EmptyPanel;
