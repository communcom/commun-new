import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Item = styled.li`
  display: flex;
  align-items: center;

  padding: 15px;

  outline: none;
`;

export default function ListItem({ name, className, children, onItemClick, onKeyDown }) {
  return (
    <Item
      tabIndex="0"
      name={name}
      className={className}
      onClick={onItemClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </Item>
  );
}

ListItem.propTypes = {
  /** Обработчик клика */
  onItemClick: PropTypes.func,
  /** Обработчик нажатия кнопки клавиатуры */
  onKeyDown: PropTypes.func,
  name: PropTypes.string,
};

ListItem.defaultProps = {
  name: null,
  onItemClick: null,
  onKeyDown: null,
};
