import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const MenuListItem = styled.li``;

const MenuButton = styled.button.attrs({ type: 'button' })`
  display: block;
  width: 100%;
  height: 100%;
  padding: 10px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  background-color: #fff;
  transition: background-color 0.15s;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.white};
  }

  ${is('isActive')`
    color: ${({ theme, isCommunity }) =>
      isCommunity ? theme.colors.community : theme.colors.blue};

  `};
`;

export default function DropDownMenuItem({ onClick, name, children, ...props }) {
  return (
    <MenuListItem {...props}>
      <MenuButton name={name} onClick={onClick}>
        {children}
      </MenuButton>
    </MenuListItem>
  );
}

DropDownMenuItem.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

DropDownMenuItem.defaultProps = {
  name: '',
};
