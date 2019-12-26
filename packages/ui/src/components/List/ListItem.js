import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Item = styled.li`
  display: flex;
  align-items: center;

  padding: 15px;

  outline: none;
`;

const ListItem = ({ className, children, onItemClick, onKeyDown }) => (
  <Item tabIndex="0" className={className} onClick={onItemClick} onKeyDown={onKeyDown}>
    {children}
  </Item>
);

ListItem.propTypes = {
  /** Обработчик клика */
  onItemClick: PropTypes.func,
  /** Обработчик нажатия кнопки клавиатуры */
  onKeyDown: PropTypes.func,
};

ListItem.defaultProps = {
  onItemClick: null,
  onKeyDown: null,
};

export default ListItem;
