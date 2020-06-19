import React, { forwardRef, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { rotate } from 'animations/keyframes';

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
  color: ${({ theme }) => theme.colors.black};
  overflow: hidden;

  &::placeholder {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  margin-right: 5px;

  & > * {
    display: none !important;
  }
  & > :last-child {
    display: flex !important;
  }

  &:hover {
    & > * {
      display: none !important;
    }
    & > :first-child {
      display: flex !important;
    }
  }
`;

const StatusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray};
`;

const ClearIcon = styled(Icon).attrs({ name: 'cross' })`
  width: 12px;
  height: 12px;
  color: #fff;
`;

const LoaderIcon = styled(Icon).attrs({ name: 'circle-loader' })`
  width: 14px;
  height: 14px;
  margin: 3px;
  animation: ${rotate} 1s linear infinite;
`;

/**
 * Компонент Поиск.
 */
const SearchComponent = (
  {
    className,
    id,
    name,
    type,
    value,
    label,
    placeholder,
    autofocus,
    inverted,
    isLoading,
    noBorder,
    onChange,
    rightComponent,
    ...props
  },
  ref
) => {
  const inputRef = useRef(null);

  const onInputChange = useCallback(
    e => {
      onChange(e.target.value, e);
    },
    [onChange]
  );

  const statusIcons = [];

  if (value.length) {
    statusIcons.push(
      <StatusButton
        key="clear"
        title="Clear"
        onClick={() => {
          onChange('');
          (ref || inputRef).current.focus();
        }}
      >
        <ClearIcon />
      </StatusButton>
    );
  }

  if (isLoading) {
    statusIcons.push(
      <StatusWrapper key="loading" title="Loading">
        <LoaderIcon />
      </StatusWrapper>
    );
  }

  function renderRightComponent() {
    if (rightComponent) {
      return rightComponent;
    }

    if (statusIcons.length) {
      return <Status>{statusIcons}</Status>;
    }

    return null;
  }

  return (
    <Search className={className} inverted={Boolean(inverted)} noBorder={noBorder}>
      <InvisibleText>{label}</InvisibleText>
      <SearchIcon />
      <SearchInput
        ref={ref || inputRef}
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={autofocus}
        autoComplete="off"
        inverted={Boolean(inverted)}
        onChange={onInputChange}
        {...props}
      />
      {renderRightComponent()}
    </Search>
  );
};

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
  /** Отображает индикатор загрузки */
  isLoading: PropTypes.bool,
  /** Элемент права от поля ввода */
  rightComponent: PropTypes.node,
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
  isLoading: false,
  rightComponent: undefined,
};

export default forwardRef(SearchComponent);
