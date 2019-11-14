import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import InvisibleText from 'components/InvisibleText';

const Search = styled.label`
  display: flex;
  align-items: center;
  height: 34px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 70px;

  ${is('inverted')`
    border: none;
    background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  `}

  ${is('noBorder')`
    border: none;
  `};
`;

const SearchIcon = styled(Icon).attrs({ name: 'search' })`
  width: 20px;
  height: 20px;
  margin: 1px 8px -1px 10px;

  color: ${({ theme }) => theme.colors.gray};
`;

const SearchInput = styled.input`
  display: flex;
  flex-grow: 1;
  align-items: center;
  min-height: 100%;
  height: 100%;
  padding: 7px 0;
  margin-right: 10px;

  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background-color: transparent;
  color: #000;
  overflow: hidden;

  &::placeholder {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1;
  }
`;

/**
 * Компонент Поиск.
 */
const SearchComponent = ({
  className,
  id,
  name,
  type,
  value,
  label,
  placeholder,
  autofocus,
  inverted,
  noBorder,
  onChange,
}) => (
  <Search className={className} inverted={Boolean(inverted)} noBorder={noBorder}>
    <InvisibleText>{label}</InvisibleText>
    <SearchIcon />
    <SearchInput
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      autoFocus={autofocus}
      inverted={Boolean(inverted)}
      onChange={onChange}
    />
  </Search>
);

SearchComponent.propTypes = {
  /** Уникальный идентификатор блока */
  id: PropTypes.string,
  /** Описание блока */
  label: PropTypes.string,
  /** Уникальное имя блока */
  name: PropTypes.string,
  /** Тип поля. */
  type: PropTypes.oneOf(['search', 'text']),
  /** Содержимое поля ввода */
  value: PropTypes.string,
  /** Подсказка в поле */
  placeholder: PropTypes.string,
  /** Серый фон */
  inverted: PropTypes.bool,
  /** Без бордера */
  noBorder: PropTypes.bool,
  /** Автофокус */
  autofocus: PropTypes.bool,
  /**
   * Обработчик изменения значения 'value'
   * @param {string} value
   */
  onChange: PropTypes.func.isRequired,
};

SearchComponent.defaultProps = {
  id: undefined,
  label: '',
  name: undefined,
  type: 'search',
  value: undefined,
  placeholder: 'Search...',
  autofocus: false,
  inverted: false,
  noBorder: false,
};

export default SearchComponent;
