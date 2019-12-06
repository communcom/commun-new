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
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  background-color: #fff;
  transition: background-color 0.15s;
  text-align: left;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  }

  ${is('isActive')`
    color: ${({ theme }) => theme.colors.blue};
  `};

  ${is('isWarning')`
    color: ${({ theme }) => theme.colors.lightRed};
  `};
`;

export default function DropDownMenuItem({
  name,
  isWarning,
  isActive,
  children,
  onClick,
  ...props
}) {
  return (
    <MenuListItem {...props}>
      <MenuButton name={name} isWarning={isWarning} isActive={isActive} onClick={onClick}>
        {children}
      </MenuButton>
    </MenuListItem>
  );
}

DropDownMenuItem.propTypes = {
  name: PropTypes.string,
  isWarning: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

DropDownMenuItem.defaultProps = {
  name: '',
  isWarning: false,
  isActive: false,
};
