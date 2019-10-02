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
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  transition: color 0.15s;

  ${is('isOpen')`
    border-radius: 8px 8px 0 0;
  `};

  ${is('noBorder')`
    border: 1px solid transparent;

    ${is('isOpen')`
      border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
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
    color: ${({ theme }) => theme.colors.contextBlue};
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
      color: ${({ theme }) => theme.colors.contextGrey} !important;
    }

    p {
      color: ${({ theme }) => theme.colors.contextGrey} !important;
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

  color: ${({ theme }) => theme.colors.contextGrey};
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
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: #fff;
  overflow-y: auto;
  z-index: 5;
`;

export default class DropdownComponent extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    selectedItem: PropTypes.shape({}),
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isCompact: PropTypes.bool,
    noCheckmark: PropTypes.bool,
    noBorder: PropTypes.bool,
    isOpen: PropTypes.bool,
    disabled: PropTypes.bool,
    listItemRenderer: PropTypes.func,
    valueRenderer: PropTypes.func,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    placeholder: '',
    isCompact: false,
    isOpen: false,
    disabled: false,
    noCheckmark: false,
    noBorder: false,
    selectedItem: {},
    listItemRenderer: undefined,
    valueRenderer: undefined,
    onClick: undefined,
  };

  state = {
    /* eslint-disable react/destructuring-assignment */
    isOpen: this.props.isOpen,
    selectedItem: this.props.selectedItem,
    /* eslint-enable */
  };

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
    const { items } = this.props;
    const { isOpen } = this.state;

    if (!isOpen && items.length > 1) {
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
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(item);
    }

    this.setState({ selectedItem: item });
    this.handleClose();
  };

  handleSelectByKeyboard = (e, item) => {
    if (e.which === KEY_CODES.ENTER || e.keyCode === KEY_CODES.ENTER) {
      const { onSelect } = this.props;

      if (onSelect) {
        onSelect(item);
      }

      this.setState({ selectedItem: item });
      this.handleClose();
    }
  };

  renderValue = () => {
    const { placeholder, valueRenderer } = this.props;
    const { selectedItem } = this.state;
    const { label } = selectedItem;

    if (valueRenderer) {
      return valueRenderer();
    }
    return <BasicValue>{label || placeholder}</BasicValue>;
  };

  renderItems = () => {
    const { items, listItemRenderer } = this.props;
    const { selectedItem } = this.state;
    const filteredItems = items.filter(item => item.value !== selectedItem.value);

    if (listItemRenderer) {
      return listItemRenderer(items, this.handleSelect);
    }

    return filteredItems.map(item => (
      <ListItem
        key={item.value}
        size="small"
        onKeyDown={e => this.handleSelectByKeyboard(e, item)}
        onItemClick={this.handleSelect(item)}
      >
        {item.label}
      </ListItem>
    ));
  };

  render() {
    const { items, noCheckmark, noBorder, isCompact, disabled, className } = this.props;
    const { isOpen } = this.state;

    return (
      <Dropdown
        ref={this.dropdownRef}
        compact={isCompact}
        disabled={disabled || items.length < 2}
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
