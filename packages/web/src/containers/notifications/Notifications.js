import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { Loader, animations } from '@commun/ui';
import InfinityScrollHelper from 'components/InfinityScrollHelper';
import NotificationList from 'components/NotificationList';
import EmptyContentHolder, { NO_NOTIFICATIONS } from 'components/EmptyContentHolder';

const Wrapper = styled.div`
  flex: 1;

  ${up('tablet')} {
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-radius: 4px;
  }
`;

const Header = styled.h1`
  height: 70px;
  padding: 0 16px;
  background-color: #fff;
`;

const HeaderLine = styled.div`
  padding-top: 9px;
`;

const HeaderText = styled.span`
  font-size: 22px;
  letter-spacing: -0.41px;
`;

const HeaderCounter = styled.span`
  margin-left: 18px;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: -0.41px;
  color: #ccc;
`;

const Main = styled.main``;

const Item = styled.li`
  list-style: none;
  background-color: #fff;
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  padding: 8px 0;
  animation: ${animations.ANIMATION_FADE_IN} 0.3s;
`;

export default class Notifications extends PureComponent {
  static propTypes = {
    isAuthorized: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    lastId: PropTypes.string,
    fetchNotifications: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastId: null,
  };

  static getInitialProps() {
    return {
      namespacesRequired: [],
    };
  }

  state = {
    isLoadingStarted: false,
  };

  componentDidMount() {
    this.loadNotifications();

    this.setState({
      isLoadingStarted: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthorized } = this.props;

    if (nextProps.isAuthorized && nextProps.isAuthorized !== isAuthorized) {
      setTimeout(() => {
        this.loadNotifications();
      }, 10);
    }
  }

  checkLoadMore = () => {
    const { lastId } = this.props;
    this.loadNotifications(lastId);
  };

  loadNotifications(fromId) {
    const { fetchNotifications, isAllowLoadMore, isAuthorized } = this.props;

    if (!isAuthorized || !isAllowLoadMore) {
      return;
    }

    fetchNotifications({ fromId }).catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }

  render() {
    const { isLoading, totalCount, order, isAllowLoadMore } = this.props;
    const { isLoadingStarted } = this.state;

    if (!isLoadingStarted || (order.length === 0 && isLoading)) {
      return <LoaderStyled />;
    }

    if (!totalCount) {
      return <EmptyContentHolder type={NO_NOTIFICATIONS} />;
    }

    return (
      <Wrapper>
        <Header>
          <HeaderLine>
            <HeaderText>Notifications</HeaderText>
            {totalCount > 0 ? <HeaderCounter>{totalCount}</HeaderCounter> : null}
          </HeaderLine>
        </Header>
        <Main>
          <InfinityScrollHelper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
            <NotificationList order={order} wrapper={Item} />
          </InfinityScrollHelper>
        </Main>
        {isLoading ? <LoaderStyled /> : null}
      </Wrapper>
    );
  }
}
