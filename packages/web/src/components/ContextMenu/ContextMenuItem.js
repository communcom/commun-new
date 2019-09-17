import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const ContextMenuListItem = styled.li``;

const ContextMenuButton = styled.button.attrs({ type: 'button' })`
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
    background-color: ${({ theme }) => theme.colors.contextWhite};
  }

  ${is('isActive')`
    color: ${({ theme, isCommunity }) =>
      isCommunity ? theme.colors.communityColor : theme.colors.contextBlue};

  `};
`;

export default function ContextMenuItem({ onClick, name, children, ...props }) {
  return (
    <ContextMenuListItem {...props}>
      <ContextMenuButton name={name} onClick={onClick}>
        {children}
      </ContextMenuButton>
    </ContextMenuListItem>
  );
}

ContextMenuItem.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

ContextMenuItem.defaultProps = {
  name: '',
};
