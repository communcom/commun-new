/* eslint-disable prefer-destructuring */

import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { withRouter } from 'next/router';

import { Loader, animations } from '@commun/ui';

import NotificationList from 'components/common/NotificationList';
import EmptyContentHolder, { NO_NOTIFICATIONS } from 'components/common/EmptyContentHolder';

const Wrapper = styled.section`
  position: absolute;
  display: block;
  top: 100%;
  right: 0;
  width: 480px;
  height: 517px;
  max-height: 80vh;
  background-color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow-y: auto;
  z-index: 5;
  animation: ${animations.fadeIn} 0.3s;
  overscroll-behavior: contain;

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
  height: 56px;
  padding: 0 16px;
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: bold;
  user-select: none;
  cursor: initial;
`;

const ClearButton = styled.button.attrs({ type: 'button' })`
  height: 100%;
  padding-left: 20px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextBlue};
  transition: color 0.15s;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.contextBlueHover};
  }
`;

const List = styled.div`
  padding-bottom: 4px;
`;

const LoadMoreLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-bottom: 10px;
`;

// const ShowAllWrapper = styled.div`
//   position: sticky;
//   left: 0;
//   bottom: 0;
//   width: 100%;
//   padding: 16px;
//   background-color: #fff;
// `;
//
// const ShowAllLink = styled.a`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 48px;
//   font-size: 15px;
//   line-height: 20px;
//   color: ${({ theme }) => theme.colors.contextBlue};
//   border: 1px solid ${({ theme }) => theme.colors.contextBlue};
//   border-radius: 4px;
//   transition: color 0.15s;
//   &:hover,
//   &:focus {
//     color: ${({ theme }) => theme.colors.contextBlueHover};
//   }
// `;

const EmptyContentHolderStyled = styled(EmptyContentHolder)`
  margin-bottom: 0;
  border: none;
`;

@withRouter
export default class NotificationsWindow extends PureComponent {
  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    lastId: PropTypes.string,
    unreadCount: PropTypes.number.isRequired,
    router: PropTypes.shape({}).isRequired,
    onNeedClose: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    markAllAsViewed: PropTypes.func.isRequired,
    markAllAsRead: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastId: null,
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
    const { lastId, isLoading, fetchNotifications, markAllAsViewed } = this.props;

    if (isLoading) {
      return;
    }

    try {
      await fetchNotifications({ fromId: isLoadMore ? lastId : null });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    markAllAsViewed().catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  };

  onRouteChange = () => {
    const { onNeedClose } = this.props;
    onNeedClose();
  };

  onAwayClick = e => {
    const { onNeedClose } = this.props;

    if (!this.wrapperRef.current.contains(e.target)) {
      onNeedClose();
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
      const { onNeedClose } = this.props;
      onNeedClose();
    }
  };

  render() {
    const { isLoading, isEnd, unreadCount, order } = this.props;
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
          {unreadCount > 0 ? (
            <ClearButton onClick={this.onReadAllClick}>Mark all as read</ClearButton>
          ) : null}
        </Header>
        <List>
          <NotificationList order={order} isCompact onClick={this.onListClick} />
          {isEnd ? null : <LoadMoreLoader>{isLoading ? <Loader /> : null}</LoadMoreLoader>}
        </List>
        {/*
        {unreadCounter > 0 ? (
          <ShowAllWrapper>
            <Link route="notifications" passHref>
              <ShowAllLink onClick={this.onAwayClick}>Show All</ShowAllLink>
            </Link>
          </ShowAllWrapper>
        ) : null}
        */}
      </Wrapper>
    );
  }
}
