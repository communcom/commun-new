import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const LIST_ITEM_SIZE = {
  small: 48,
  medium: 64,
  large: 80,
};

const Item = styled.li`
  display: flex;
  align-items: center;

  padding-left: 16px;

  height: ${({ size }) => LIST_ITEM_SIZE[size]}px;

  /** TODO */
  ${is('onClick')`
    cursor: pointer;
    user-select: none;

    transition: background-color 0.15s;

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.contextLightGrey};
    }
  `}
`;

const ListItem = ({ className, children, size, onItemClick, onKeyDown }) => (
  <Item tabIndex="0" className={className} size={size} onClick={onItemClick} onKeyDown={onKeyDown}>
    {children}
  </Item>
);

ListItem.propTypes = {
  /** Дополнительный класс */
  className: PropTypes.string,
  /** Размер */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Обработчик клика */
  onItemClick: PropTypes.func,
  /** Обработчик нажатия кнопки клавиатуры */
  onKeyDown: PropTypes.func,
};

ListItem.defaultProps = {
  className: undefined,
  size: 'medium',
  onItemClick: null,
  onKeyDown: null,
};

export default ListItem;
