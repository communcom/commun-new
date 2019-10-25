import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import throttle from 'lodash.throttle';

import { Icon } from '@commun/icons';

import { List } from 'components/List';
import InvisibleText from 'components/InvisibleText';
import Avatar from 'components/Avatar';
import * as styles from 'styles';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 15px 0;
  border-radius: 8px;

  ${({ theme, isOpen }) => `
    background-color: ${theme.colors.contextWhite};

    ${
      isOpen
        ? `box-shadow: inset 0 0 0 1px ${
            theme.colors.contextLightGrey
          }; border-radius: 8px 8px 0 0;`
        : ``
    };
  `};
`;

const DropdownIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  margin-left: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const Input = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 15px 16px;
  line-height: 20px;
  font-size: 15px;
  background-color: transparent;
  color: #000;

  &::placeholder {
    color: ${({ theme }) => theme.colors.contextGrey};
  }

  &:focus::placeholder,
  &:active::placeholder {
    opacity: 0;
  }
`;

const ItemsList = styled(List)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  max-height: 40vh;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: #fff;
  overflow-y: auto;
`;

const ListItem = styled.li``;

const ListItemButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 16px;
  min-height: 48px;
  line-height: 20px;
  font-size: 15px;
  ${styles.overflowEllipsis};
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlue};
  }
`;

const ListItemName = styled.div`
  text-align: left;
  ${styles.overflowEllipsis};
`;

const ListItemQuantity = styled.div`
  flex-shrink: 0;
  margin-left: auto;
  padding: 0 0 0 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

const WrappedAvatar = styled(Avatar)`
  margin-right: 16px;
`;

const RightNumber = styled.div`
  flex-shrink: 0;
  padding-right: 16px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default class InputWithDropdown extends PureComponent {
  static propTypes = {
    isRightNumber: PropTypes.bool,
    inputValue: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string.isRequired,
    entities: PropTypes.arrayOf(PropTypes.shape({})),

    keyPressHandler: PropTypes.func.isRequired,
    changeInputHandler: PropTypes.func.isRequired,
    selectValueHandler: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isRightNumber: false,
    inputValue: '',
    placeholder: '',
    entities: [],
  };

  state = {
    filteredItems: [],
  };

  lazyEntitiesFiltration = throttle(this.entitiesFiltration, 500);

  componentWillUnmount() {
    this.lazyEntitiesFiltration.cancel();
  }

  listItemClick = item => {
    const { selectValueHandler } = this.props;
    selectValueHandler(item);
    this.setState({ filteredItems: [] });
  };

  onInputChange = e => {
    const { changeInputHandler } = this.props;
    const inputValue = e.target.value;
    changeInputHandler(inputValue);

    this.lazyEntitiesFiltration(inputValue);
  };

  entitiesFiltration(inputValue) {
    const { entities, selectValueHandler } = this.props;

    if (inputValue) {
      const filterTextLower = inputValue.toLowerCase().trim();
      const filteredItems = entities.filter(item =>
        item.name.toLowerCase().includes(filterTextLower)
      );
      if (filteredItems.length === 1 && filteredItems[0].name.toLowerCase() === filterTextLower) {
        selectValueHandler(filteredItems[0].name);
        this.setState({ filteredItems: [] });
      } else {
        this.setState({ filteredItems });
      }
    } else {
      this.setState({ filteredItems: [] });
    }
  }

  renderDropdown() {
    const { filteredItems } = this.state;

    return filteredItems.map(({ name, avatarUrl }, index) => (
      // eslint-disable-next-line
      <ListItem key={`${name}${index}`}>
        <ListItemButton onClick={() => this.listItemClick(name)}>
          <WrappedAvatar size="small" avatarUrl={avatarUrl} name={name} />
          <ListItemName>{name}</ListItemName>
          <ListItemQuantity>126,930</ListItemQuantity>
        </ListItemButton>
      </ListItem>
    ));
  }

  render() {
    const {
      inputValue,
      placeholder,
      title,
      keyPressHandler,
      isRightNumber,
      className,
    } = this.props;
    const { filteredItems } = this.state;

    return (
      <Wrapper isOpen={filteredItems.length} className={className}>
        <InvisibleText as="label" htmlFor={placeholder}>
          {title}
        </InvisibleText>
        <DropdownIcon name="dropdown" />
        <Input
          name={placeholder}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onKeyPress={keyPressHandler}
          onChange={this.onInputChange}
        />
        {isRightNumber && <RightNumber>0</RightNumber>}
        {Boolean(filteredItems.length) && <ItemsList>{this.renderDropdown()}</ItemsList>}
      </Wrapper>
    );
  }
}
