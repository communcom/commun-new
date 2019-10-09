import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Search, Dropdown, List, CommunityItem } from '@commun/ui';

const testItems = [
  {
    id: 1,
    avatarUrl: 'https://cdn.auth0.com/blog/es6rundown/logo.png',
    primaryText: 'Java Script',
  },
  {
    id: 2,
    avatarUrl: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
    primaryText: 'React',
  },
  {
    id: 3,
    avatarUrl: 'https://devstickers.com/assets/img/pro/h8ci.png',
    primaryText: 'Redux',
  },
];

const StyledSearch = styled(Search).attrs({ type: 'text' })`
  flex-grow: 1;
  border: none;
`;

export default class CommunitySelect extends PureComponent {
  static propTypes = {};

  state = {
    selectedItem: null,
  };

  listItemRenderer = (items, onItemClick) =>
    items.map(({ id, avatarUrl, primaryText, secondaryText }, index) => (
      <CommunityItem
        key={id}
        size="small"
        avatarUrl={avatarUrl}
        primary={primaryText}
        primaryBold
        secondary={secondaryText}
        onItemClick={onItemClick(index)}
      />
    ));

  renderCommunityItem = ({ avatarUrl, primaryText, secondaryText }) => (
    <CommunityItem
      size="small"
      avatarUrl={avatarUrl}
      primary={primaryText}
      primaryBold
      secondary={secondaryText}
    />
  );

  valueRenderer = () => {
    const { selectedItem } = this.state;
    if (selectedItem) {
      return <List>{this.renderCommunityItem(selectedItem)}</List>;
    }
    return <StyledSearch onChange={this.handleSearchChange} />;
  };

  handleItemSelect = (value, item) => {
    this.setState({ selectedItem: item });
  };

  handleSearchChange = () => {
    // TODO:
  };

  handleClick = () => {
    // TODO
  };

  render() {
    const { selectedItem } = this.state;

    return (
      <Dropdown
        value={selectedItem?.value}
        items={testItems}
        listItemRenderer={this.listItemRenderer}
        valueRenderer={this.valueRenderer}
        onSelect={this.handleItemSelect}
        onClick={this.handleClick}
      />
    );
  }
}
