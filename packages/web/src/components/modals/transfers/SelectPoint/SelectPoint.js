import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Search, up } from '@commun/ui';

import { pointsArrayType } from 'types/common';
import { withTranslation } from 'shared/i18n';
import { multiArgsMemoize } from 'utils/common';

import { PointsList, EmptyPanel } from 'components/wallet/';
import { CloseButtonStyled } from '../common.styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  bottom: 0;

  height: 550px;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px 25px 0 0;
  overflow: hidden;

  ${up.mobileLandscape} {
    position: relative;

    width: 350px;

    border-radius: 25px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 15px;
  padding: 20px 15px 0;

  width: 100%;
`;

const HeaderTitle = styled.div`
  flex-grow: 1;

  margin-bottom: 15px;

  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
`;

const SearchStyled = styled(Search)`
  width: 100%;
`;

const Content = styled.div`
  flex-grow: 1;

  padding: 0 10px;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.lightGrayBlue};
  overflow-y: scroll;
`;

const EmptyPanelStyled = styled(EmptyPanel)`
  margin-top: 15px;

  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
`;

@withTranslation()
export default class SelectPoint extends PureComponent {
  static propTypes = {
    points: pointsArrayType,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
  };

  state = {
    filterText: '',
  };

  filterItems = multiArgsMemoize((items, filterText) => {
    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();
      return items.filter(({ name }) => name.toLowerCase().startsWith(filterTextLower));
    }

    return items;
  });

  filterChangeHandler = text => {
    this.setState({
      filterText: text,
    });
  };

  itemClickHandler = name => {
    const { close } = this.props;

    close({ selectedItem: name });
  };

  closeModal = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { points, t } = this.props;
    const { filterText } = this.state;

    const pointsArray = Array.from(points.values());

    const finalItems = filterText.trim()
      ? this.filterItems(pointsArray, filterText.trim())
      : pointsArray;

    const pointsList = finalItems.length ? (
      <PointsList
        points={finalItems}
        itemName="select-points__item"
        itemClickHandler={this.itemClickHandler}
      />
    ) : (
      <EmptyPanelStyled
        primary={t('modals.transfers.select_point.no_found')}
        secondary={t('modals.transfers.select_point.no_found_desc')}
      />
    );

    return (
      <Wrapper>
        <Header>
          <HeaderTitle>{t('modals.transfers.select_point.title')}</HeaderTitle>
          <CloseButtonStyled right onClick={this.closeModal} />
          <SearchStyled
            inverted
            label={t('modals.transfers.select_point.search')}
            type="search"
            placeholder={t('common.search_placeholder')}
            value={filterText}
            onChange={this.filterChangeHandler}
          />
        </Header>
        <Content>{pointsList}</Content>
      </Wrapper>
    );
  }
}
