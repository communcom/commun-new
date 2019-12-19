import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Loader, animations } from '@commun/ui';
import { displayError } from 'utils/toastsMessages';
import Content, { StickyAside } from 'components/common/Content';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import NotificationList from 'components/common/NotificationList';
import EmptyContentHolder, { NO_NOTIFICATIONS } from 'components/common/EmptyContentHolder';

const Wrapper = styled.div`
  flex: 1;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const FiltersPanel = styled.div`
  padding: 15px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.h1`
  padding: 15px 15px 20px;
`;

const HeaderText = styled.span`
  display: block;
  line-height: 28px;
  font-size: 20px;
  font-weight: bold;
`;

const Main = styled.main``;

const Item = styled.li`
  list-style: none;
  margin-bottom: 20px;
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
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastTimestamp: PropTypes.string,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastTimestamp: null,
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
    this.loadNotifications(true);
  };

  async loadNotifications(isPaging) {
    const { isAllowLoadMore, isAuthorized, lastTimestamp, fetchNotifications } = this.props;

    if (!isAuthorized || !isAllowLoadMore) {
      return;
    }

    try {
      await fetchNotifications({ beforeThan: isPaging ? lastTimestamp : null });
    } catch (err) {
      displayError(err);
    }
  }

  renderMain() {
    const { isLoading, order, isAllowLoadMore } = this.props;
    const { isLoadingStarted } = this.state;

    if (!isLoadingStarted || (order.length === 0 && isLoading)) {
      return <LoaderStyled />;
    }

    if (!order.length) {
      return <EmptyContentHolder type={NO_NOTIFICATIONS} />;
    }

    return (
      <Wrapper>
        <Header>
          <HeaderText>Notifications</HeaderText>
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

  render() {
    return (
      <Content
        aside={() => (
          <StickyAside>
            <FiltersPanel>Filters (not ready yet)</FiltersPanel>
          </StickyAside>
        )}
      >
        {this.renderMain()}
      </Content>
    );
  }
}
