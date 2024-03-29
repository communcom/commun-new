import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const MenuListItem = styled.li``;

const MenuButton = styled.button.attrs({ type: 'button' })`
  display: block;
  width: 100%;
  height: 100%;
  padding: 10px 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.white};
  transition: background-color 0.15s;
  text-align: left;
  appearance: none;

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
  href,
  target,
  onClick,
  className,
  ...props
}) {
  return (
    <MenuListItem {...props}>
      <MenuButton
        as={href ? 'a' : undefined}
        name={name}
        isWarning={isWarning}
        isActive={isActive}
        href={href}
        target={target}
        onClick={onClick}
        className={className}
      >
        {children}
      </MenuButton>
    </MenuListItem>
  );
}

DropDownMenuItem.propTypes = {
  name: PropTypes.string,
  isWarning: PropTypes.bool,
  isActive: PropTypes.bool,
  href: PropTypes.string,
  target: PropTypes.string,
  onClick: PropTypes.func,
};

DropDownMenuItem.defaultProps = {
  name: '',
  isWarning: false,
  isActive: false,
  href: undefined,
  target: undefined,
  onClick: undefined,
};
