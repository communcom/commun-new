import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Primary = styled.div`
  font-size: 15px;
  text-transform: capitalize;
  line-height: 1;
  color: ${({ theme }) => theme.colors.black};

  ${is('primaryBold')`
    font-weight: 600;
  `}
`;

const Secondary = styled.p`
  margin-top: 8px;

  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

const ListItemText = ({ className, primary, primaryBold, secondary }) => (
  <Wrapper className={className}>
    <Primary primaryBold={Boolean(primaryBold)}>{primary}</Primary>
    {Boolean(secondary) && <Secondary>{secondary}</Secondary>}
  </Wrapper>
);

ListItemText.propTypes = {
  primaryBold: PropTypes.bool,
  primary: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  secondary: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

ListItemText.defaultProps = {
  primaryBold: false,
  secondary: null,
};

export default ListItemText;
