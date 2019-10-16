import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommonStyles = `
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
`;

const HeaderText = styled.span`
  ${CommonStyles};
  color: ${({ theme }) => theme.colors.contextGreySecond};
`;

const Button = styled.button.attrs({ type: 'button' })`
  ${CommonStyles};
  text-align: right;
  text-transform: lowercase;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default function CardHeader(props) {
  const { headerText, buttonText } = props;

  return (
    <Header>
      <HeaderText>{headerText}</HeaderText>
      <Button>{buttonText}</Button>
    </Header>
  );
}

CardHeader.propTypes = {
  headerText: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
};

CardHeader.defaultProps = {
  buttonText: 'see all',
};
