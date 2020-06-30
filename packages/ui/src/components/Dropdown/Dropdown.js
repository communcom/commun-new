import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { difference, pluck, uniq } from 'ramda';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';

import { KEY_CODES } from 'constants';

import { List, ListItem } from 'components/List';

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;

  height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  transition: color 0.15s;

  ${is('isOpen')`
    border-radius: 8px 8px 0 0;
  `};

  ${is('noBorder')`
    border: 1px solid transparent;

    ${is('isOpen')`
      border: 1px solid ${({ theme }) => theme.colors.lightGray};
      border-radius: 8px 8px 0 0;
    `};
  `};
`;

const Dropdown = styled.div`
  position: relative;
  outline: none;
  border-radius: 8px 8px 0 0;
  user-select: none;
  cursor: pointer;

  &:hover ${/* sc-selector */ ValueWrapper}, &:focus ${/* sc-selector */ ValueWrapper} {
    color: ${({ theme }) => theme.colors.blue};
  }

  ${is('compact')`
    font-size: 13px;
  `};

  ${is('disabled')`
    cursor: initial;

    & * {
      cursor: initial !important;
    }

    &:hover p, &:focus p {
      color: ${({ theme }) => theme.colors.gray} !important;
    }

    p {
      color: ${({ theme }) => theme.colors.gray} !important;
    }
  `}
`;

const BasicValue = styled.div`
  flex-grow: 1;
  padding-left: 16px;
  user-select: none;
`;

const Checkmark = styled(Icon).attrs({ name: 'downvote' })`
  margin: 0 10px 0 16px;

  width: 20px;
  height: 20px;

  color: ${({ theme }) => theme.colors.gray};
  transition: transform 0.15s;

  ${is('isOpen')`
    transform: rotate(180deg);
  `}

  ${is('compact')`
    margin: 0 10px;
    width: 16px;
    height: 16px;
  `};
`;

const ItemsList = styled(List)`
  position: absolute;
  max-height: 40vh;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  z-index: 5;
`;

const ListItemStyled = styled(ListItem)`
  justify-content: space-between;
`;

const Checked = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.blue};
`;

export default class DropdownComponent extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.string,
    valueField: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isCompact: PropTypes.bool,
    isMulti: PropTypes.bool,
    noCheckmark: PropTypes.bool,
    noBorder: PropTypes.bool,
    disabled: PropTypes.bool,
    listItemRenderer: PropTypes.func,
    valueRenderer: PropTypes.func,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    placeholder: '',
    isCompact: false,
    isMulti: false,
    disabled: false,
    noCheckmark: false,
    noBorder: false,
    value: null,
    valueField: 'value',
    listItemRenderer: undefined,
    valueRenderer: undefined,
    onClick: undefined,
  };

  state = {
    isOpen: false,
  };

  // eslint-disable-next-line react/sort-comp
  dropdownRef = createRef();

  componentDidMount() {
    this.openingTimeout = setTimeout(() => {
      window.addEventListener('click', this.onAwayClick);
    }, 100);
  }

  componentWillUnmount() {
    clearTimeout(this.openingTimeout);
    window.removeEventListener('click', this.onAwayClick);
  }

  onAwayClick = e => {
    if (!this.dropdownRef.current.contains(e.target)) {
      this.handleClose();
    }
  };

  handleOpen = () => {
    const { value, items, valueField } = this.props;
    const { isOpen } = this.state;

    if (isOpen) {
      return;
    }

    if (items.length > 1 || (items.length === 1 && items[0][valueField] !== value)) {
      this.setState({
        isOpen: true,
      });
    }
  };

  handleClose = () => {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({
        isOpen: false,
      });
    }
  };

  handleClick = () => {
    const { onClick, disabled, isMulti } = this.props;
    const { isOpen } = this.state;

    if (disabled) {
      return;
    }

    if (isOpen) {
      if (!isMulti) {
        this.handleClose();
      }
    } else {
      this.handleOpen();
    }

    if (onClick && !isMulti) {
      onClick();
    }
  };

  handleKeyDown = e => {
    const { onClick, disabled, isMulti } = this.props;
    const { isOpen } = this.state;

    if (disabled) {
      return;
    }

    if (e.which === KEY_CODES.ENTER || e.keyCode === KEY_CODES.ENTER) {
      if (isOpen) {
        this.handleClose();
      } else {
        this.handleOpen();
      }

      if (onClick) {
        onClick();
      }
    }

    if (e.which === KEY_CODES.ESC || e.keyCode === KEY_CODES.ESC) {
      if (isOpen && !isMulti) {
        this.handleClose();
      }
    }
  };

  handleSelect = item => () => {
    const { value, items, valueField, onSelect, isMulti } = this.props;

    if (onSelect) {
      if (isMulti) {
        let newItems = [];

        // if it's already selected - toggle off
        if (value.find(el => el === item[valueField])) {
          newItems = value.filter(el => el !== item[valueField]);
        } else {
          newItems = [...value, item[valueField]];
        }

        // if it same with "items" so user selected "All"
        const allItems = pluck(valueField)(items);
        if (!difference(allItems)(newItems).length) {
          newItems = [];
        }

        onSelect(uniq(newItems), item);
      } else {
        onSelect(item[valueField], item);
      }
    }

    if (!isMulti) {
      this.handleClose();
    }
  };

  handleSelectByKeyboard = e => {
    if (e.which === KEY_CODES.ENTER || e.keyCode === KEY_CODES.ENTER) {
      this.handleSelect();
    }
  };

  renderValue = () => {
    const { value, valueField, items, placeholder, valueRenderer, isMulti } = this.props;

    if (valueRenderer) {
      return valueRenderer();
    }

    let text = placeholder;

    if (value) {
      if (isMulti && value.length) {
        const textArray = value.map(selectedValue => {
          const selectedItem = items.find(item => item[valueField] === selectedValue);

          if (selectedItem) {
            return selectedItem.label;
          }

          return null;
        });

        text = textArray.join(', ');
      } else {
        const selectedItem = items.find(item => item[valueField] === value);

        if (selectedItem) {
          text = selectedItem.label;
        }
      }
    }

    return <BasicValue>{text}</BasicValue>;
  };

  renderItems = () => {
    const { value, valueField, items, listItemRenderer, isMulti } = this.props;
    let filteredItems = items;

    if (!isMulti) {
      filteredItems = items.filter(item => item[valueField] !== value);
    }

    if (listItemRenderer) {
      return listItemRenderer(items, this.handleSelect);
    }

    return filteredItems.map(item => (
      <ListItemStyled
        key={item[valueField]}
        size="small"
        onKeyDown={e => this.handleSelectByKeyboard(e, item)}
        onItemClick={this.handleSelect(item)}
      >
        {item.label}
        {isMulti && value.find(el => el === item[valueField]) ? <Checked /> : null}
      </ListItemStyled>
    ));
  };

  render() {
    const { noCheckmark, noBorder, isCompact, disabled, className } = this.props;
    const { isOpen } = this.state;

    return (
      <Dropdown
        ref={this.dropdownRef}
        compact={isCompact}
        disabled={disabled}
        className={className}
        tabIndex="0"
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <ValueWrapper isOpen={isOpen} noBorder={noBorder}>
          {this.renderValue()}
          {noCheckmark ? null : <Checkmark isOpen={isOpen} compact={isCompact} />}
        </ValueWrapper>
        {isOpen && <ItemsList>{this.renderItems()}</ItemsList>}
      </Dropdown>
    );
  }
}
