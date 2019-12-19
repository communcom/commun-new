/* eslint-disable prefer-destructuring,no-unused-vars */

import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { withRouter } from 'next/router';

import { Loader, animations } from '@commun/ui';

import { Link } from 'shared/routes';
import { displayError } from 'utils/toastsMessages';
import NotificationList from 'components/common/NotificationList';
import EmptyContentHolder, { NO_NOTIFICATIONS } from 'components/common/EmptyContentHolder';

const Wrapper = styled.section`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: calc(100% + 10px);
  right: 0;
  width: 400px;
  height: 517px;
  max-height: 80vh;
  background-color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 5;
  overflow: hidden;
  animation: ${animations.fadeIn} 0.3s;

  ${is('isMini')`
    height: auto;
  `};
`;

const ErrorBlock = styled.p`
  display: flex;
  padding: 20px 24px;
  color: #f00;
`;

const InitialLoader = styled(Loader)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0;
  animation: ${animations.fadeIn} 0.3s forwards;
  animation-delay: 0.1s;

  & svg {
    width: 56px;
    height: 56px;
    color: #bbb;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  height: 50px;
  padding: 0 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: bold;
  user-select: none;
  cursor: initial;
`;

/*
const ClearButton = styled.button.attrs({ type: 'button' })`
  height: 100%;
  padding-left: 20px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;
*/

const List = styled.div`
  padding: 15px 0 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

const LoadMoreLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-bottom: 10px;
`;

const ShowAllWrapper = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.lightGrayBlue};
`;

const ShowAllLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 45px;
  border-radius: 0 0 10px 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue};
  background-color: ${({ theme }) => theme.colors.white};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blueHover};
  }
`;

const EmptyContentHolderStyled = styled(EmptyContentHolder)`
  margin-bottom: 0;
  border: none;
`;

@withRouter
export default class NotificationsWindow extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastTimestamp: PropTypes.string,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    router: PropTypes.shape({}).isRequired,
    close: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    markAllAsViewed: PropTypes.func.isRequired,
    markAllAsRead: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastTimestamp: null,
  };

  state = {
    isError: false,
    errorMessage: null,
    isLoadingStarted: false,
  };

  wrapperRef = createRef();

  async componentDidMount() {
    const { router } = this.props;

    this.clickTimeout = setTimeout(() => {
      window.addEventListener('click', this.onAwayClick);
    }, 50);

    router.events.on('routeChangeStart', this.onRouteChange);

    this.loadNotifications();

    this.setState({
      isLoadingStarted: true,
    });
  }

  // eslint-disable-next-line react/sort-comp
  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.error('Notifications List render failed:', err);

    this.setState({
      isError: true,
      errorMessage: err.message,
    });
  }

  componentWillUnmount() {
    const { router } = this.props;

    clearTimeout(this.clickTimeout);
    window.removeEventListener('click', this.onAwayClick);

    router.events.off('routeChangeStart', this.onRouteChange);
  }

  loadNotifications = async isLoadMore => {
    const { isLoading, lastTimestamp, fetchNotifications, markAllAsViewed } = this.props;

    if (isLoading) {
      return;
    }

    try {
      await fetchNotifications({
        isTray: true,
        beforeThan: isLoadMore ? lastTimestamp : null,
      });
    } catch (err) {
      displayError(err);
    }

    markAllAsViewed().catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  };

  onRouteChange = () => {
    const { close } = this.props;
    close();
  };

  onAwayClick = e => {
    const { close } = this.props;

    if (!this.wrapperRef.current.contains(e.target)) {
      close();
    }
  };

  onReadAllClick = () => {
    const { markAllAsRead } = this.props;
    markAllAsRead().catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  };

  onScroll = () => {
    const { isAllowLoadMore } = this.props;
    const wrapper = this.wrapperRef.current;

    if (!isAllowLoadMore || !wrapper) {
      return;
    }

    const windowHeight = wrapper.clientHeight;
    const innerHeight = wrapper.scrollHeight;
    const scrollTop = wrapper.scrollTop;

    const remains = innerHeight - scrollTop - windowHeight;

    if (remains < windowHeight * 0.8) {
      this.loadNotifications(true);
    }
  };

  onListClick = e => {
    if (e.target.closest('a')) {
      const { close } = this.props;
      close();
    }
  };

  render() {
    const { isLoading, isEnd, order } = this.props;
    const { isLoadingStarted, isError, errorMessage } = this.state;

    if (isError) {
      return (
        <Wrapper ref={this.wrapperRef} isMini>
          <ErrorBlock>{errorMessage}</ErrorBlock>
        </Wrapper>
      );
    }

    if (!isLoadingStarted || (order.length === 0 && isLoading)) {
      return (
        <Wrapper ref={this.wrapperRef}>
          <InitialLoader />
        </Wrapper>
      );
    }

    if (order.length === 0) {
      return (
        <Wrapper ref={this.wrapperRef}>
          <EmptyContentHolderStyled type={NO_NOTIFICATIONS} />
        </Wrapper>
      );
    }

    return (
      <Wrapper ref={this.wrapperRef} onScroll={this.onScroll}>
        <Header>
          <Title>Notifications</Title>
          {/* unreadCount > 0 ? (
            <ClearButton onClick={this.onReadAllClick}>Mark all as read</ClearButton>
          ) : null */}
        </Header>
        <List>
          <NotificationList order={order} onClick={this.onListClick} />
          {isEnd ? null : <LoadMoreLoader>{isLoading ? <Loader /> : null}</LoadMoreLoader>}
        </List>
        {order.length > 0 ? (
          <ShowAllWrapper>
            <Link route="notifications" passHref>
              <ShowAllLink onClick={this.onAwayClick}>See all</ShowAllLink>
            </Link>
          </ShowAllWrapper>
        ) : null}
      </Wrapper>
    );
  }
}
