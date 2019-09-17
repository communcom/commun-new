import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Primary = styled.div`
  display: block;

  font-size: 15px;
  letter-spacing: -0.41px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.contextBlack};

  ${is('primaryBold')`
    font-weight: 600;
  `}
`;

const Secondary = styled.p`
  margin-top: 4px;

  font-size: 13px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.colors.contextGrey};
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
