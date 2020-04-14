import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
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

export default class DropdownComponent extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.string,
    valueField: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isCompact: PropTypes.bool,
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
    const { onClick, disabled } = this.props;
    const { isOpen } = this.state;

    if (disabled) {
      return;
    }

    if (isOpen) {
      this.handleClose();
    } else {
      this.handleOpen();
    }
    if (onClick) {
      onClick();
    }
  };

  handleKeyDown = e => {
    const { onClick, disabled } = this.props;
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
      if (isOpen) {
        this.handleClose();
      }
    }
  };

  handleSelect = item => () => {
    const { valueField, onSelect } = this.props;

    if (onSelect) {
      onSelect(item[valueField], item);
    }

    this.handleClose();
  };

  handleSelectByKeyboard = (e, item) => {
    if (e.which === KEY_CODES.ENTER || e.keyCode === KEY_CODES.ENTER) {
      const { valueField, onSelect } = this.props;

      if (onSelect) {
        onSelect(item[valueField], item);
      }

      this.handleClose();
    }
  };

  renderValue = () => {
    const { value, valueField, items, placeholder, valueRenderer } = this.props;

    if (valueRenderer) {
      return valueRenderer();
    }

    let text = placeholder;

    if (value) {
      const selectedItem = items.find(item => item[valueField] === value);

      if (selectedItem) {
        text = selectedItem.label;
      }
    }

    return <BasicValue>{text}</BasicValue>;
  };

  renderItems = () => {
    const { value, valueField, items, listItemRenderer } = this.props;
    const filteredItems = items.filter(item => item[valueField] !== value);

    if (listItemRenderer) {
      return listItemRenderer(items, this.handleSelect);
    }

    return filteredItems.map(item => (
      <ListItem
        key={item[valueField]}
        size="small"
        onKeyDown={e => this.handleSelectByKeyboard(e, item)}
        onItemClick={this.handleSelect(item)}
      >
        {item.label}
      </ListItem>
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
