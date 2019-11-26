import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LIST_ITEM_SIZE = {
  small: 48,
  medium: 64,
  large: 70,
};

const Item = styled.li`
  display: flex;
  align-items: center;

  padding: 15px;
  height: ${({ size }) => LIST_ITEM_SIZE[size]}px;

  outline: none;
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
  size: 'large',
  onItemClick: null,
  onKeyDown: null,
};

export default ListItem;
