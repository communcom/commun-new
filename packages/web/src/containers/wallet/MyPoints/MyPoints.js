import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card, Search, List, ListItem, ListItemAvatar, ListItemText, Avatar, up } from '@commun/ui';
import { Icon } from '@commun/icons';

import { pointsArrayType } from 'types/common';
import EmptyContentHolder, { NO_POINTS } from 'components/common/EmptyContentHolder';
import DropDownMenu, { DropDownMenuItem } from 'components/common/DropDownMenu';

import { SHOW_MODAL_CONVERT_POINTS, SHOW_MODAL_SEND_POINTS } from 'store/constants/modalTypes';

const Wrapper = styled(Card)`
  min-height: 100%;
  padding-top: 8px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
`;

const TabHeaderWrapper = styled.div`
  display: block;
`;

const Title = styled.h2`
  display: inline-block;
  font-size: 22px;
  line-height: 22px;
  vertical-align: baseline;
`;

const PointsCount = styled.span`
  display: inline-block;
  padding-left: 12px;
  font-size: 15px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.contextGrey};
  vertical-align: baseline;

  ${up.tablet} {
    padding-left: 24px;
  }
`;

const AddPointsButton = styled.button.attrs({ type: 'button' })`
  height: 100%;
  padding-left: 20px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const PointsList = styled(List)`
  margin-top: 8px;
`;

const PointsItem = styled(ListItem)`
  ${up.tablet} {
    min-height: 80px;
  }
`;

const PointAvatar = styled(Avatar)`
  ${up.tablet} {
    width: 56px;
    height: 56px;
  }
`;

const PointsName = styled(ListItemText)`
  ${up.tablet} {
    font-size: 17px;
  }
`;

const PointsNumber = styled.p`
  margin-left: auto;
  font-weight: 600;
  line-height: normal;
  font-size: 15px;
  color: #000;

  ${up.tablet} {
    font-size: 17px;
  }
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const MenuButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 12px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }

  ${up.tablet} {
    display: none;
  }
`;

const IconStyled = styled(Icon)`
  width: 24px;
  height: 24px;
`;

const ActionsPanel = styled.ul`
  display: none;

  ${up.tablet} {
    display: flex;
  }
`;

const ActionsItem = styled.li``;

const ActionButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 18px;
  color: ${({ theme }) => theme.colors.contextGrey};

  & > * {
    transition: color 0.15s;
  }

  &:hover > *,
  &:focus > * {
    color: ${({ theme }) => theme.colors.contextBlue};
  }

  ${up.tablet} {
    padding-left: 25px;
  }
`;

export default class MyPoints extends PureComponent {
  static propTypes = {
    points: pointsArrayType,
    loggedUserId: PropTypes.string,
    isBalanceUpdated: PropTypes.bool,

    openModal: PropTypes.func.isRequired,
    getBalance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    loggedUserId: null,
    isBalanceUpdated: false,
  };

  state = {
    filterText: '',
  };

  async componentDidMount() {
    const { getBalance, loggedUserId, isBalanceUpdated } = this.props;

    if (!isBalanceUpdated) {
      try {
        await getBalance(loggedUserId);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    }
  }

  getActions = pointName => [
    {
      action: 'Send points',
      icon: 'send-points',
      handler: () => this.sendPointsHandler(pointName),
    },
    {
      action: 'Convert points',
      icon: 'transfer-points',
      handler: () => this.convertPointsHandler(pointName),
    },
  ];

  getPoints = () => {
    const { points } = this.props;
    const { filterText } = this.state;

    if (filterText) {
      const filterTextLower = filterText.toLowerCase().trim();

      return points.filter(({ name }) => name.toLowerCase().includes(filterTextLower));
    }

    return points;
  };

  filterChangeHandler = e => {
    this.setState({
      filterText: e.target.value,
    });
  };

  sendPointsHandler = pointName => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SEND_POINTS, { pointName });
  };

  addPointsHandler = () => {
    // TODO: here will be addPointsHandler
  };

  convertPointsHandler = pointName => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_CONVERT_POINTS, { pointName });
  };

  render() {
    const { filterText } = this.state;
    const points = this.getPoints();

    if (!points.length && !filterText) {
      return <EmptyContentHolder type={NO_POINTS} />;
    }

    return (
      <Wrapper>
        <Header>
          <TabHeaderWrapper>
            <Title>My points</Title>
            <PointsCount>{points.length}</PointsCount>
          </TabHeaderWrapper>
          <AddPointsButton onClick={this.addPointsHandler}>+ New Points</AddPointsButton>
        </Header>
        <Search
          inverted
          label="Search points"
          type="search"
          placeholder="Search..."
          value={filterText}
          onChange={this.filterChangeHandler}
        />
        <PointsList>
          {points.map(({ symbol, balance, logo }) => (
            <PointsItem key={symbol}>
              <ListItemAvatar>
                <PointAvatar size="large" avatarUrl={logo} name={symbol} />
              </ListItemAvatar>
              <PointsName primary={symbol} primaryBold />
              <RightPanel>
                <PointsNumber>{balance}</PointsNumber>
                <DropDownMenu
                  align="right"
                  openAt="top"
                  handler={props => (
                    <MenuButton name="my-points__more-actions" aria-label="More actions" {...props}>
                      <IconStyled name="more" />
                    </MenuButton>
                  )}
                  items={() => (
                    <>
                      <DropDownMenuItem
                        name="my-points__send-points"
                        onClick={() => this.sendPointsHandler(symbol)}
                      >
                        Send points
                      </DropDownMenuItem>
                      <DropDownMenuItem
                        name="my-points__convert-points"
                        onClick={() => this.convertPointsHandler(symbol)}
                      >
                        Convert points
                      </DropDownMenuItem>
                    </>
                  )}
                />
                <ActionsPanel>
                  {this.getActions(symbol).map(({ action, icon, handler }) => (
                    <ActionsItem key={action}>
                      <ActionButton
                        name={`my-points__${action.replace(' ', '-').toLowerCase()}`}
                        aria-label={action}
                        onClick={handler}
                      >
                        <IconStyled name={icon} />
                      </ActionButton>
                    </ActionsItem>
                  ))}
                </ActionsPanel>
              </RightPanel>
            </PointsItem>
          ))}
        </PointsList>
      </Wrapper>
    );
  }
}
