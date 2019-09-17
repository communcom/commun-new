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

export default class SearchComm extends PureComponent {
  static propTypes = {};

  state = {
    isResultsOpen: false,
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

  handleItemSelect = item => {
    this.setState({ selectedItem: item, isResultsOpen: false });
  };

  handleSearchChange = event => {
    const { value } = event.target;

    // exmple
    let open;
    if (value.length >= 3) {
      open = true;
    } else {
      open = false;
    }
    this.setState({ isResultsOpen: open });
  };

  handleClick = () => {
    // TODO
  };

  render() {
    const { isResultsOpen } = this.state;
    return (
      <Dropdown
        isOpen={isResultsOpen}
        items={testItems}
        listItemRenderer={this.listItemRenderer}
        valueRenderer={this.valueRenderer}
        onSelect={this.handleItemSelect}
        onClick={this.handleClick}
      />
    );
  }
}
