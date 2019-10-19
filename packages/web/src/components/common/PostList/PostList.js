/* eslint-disable no-shadow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { fetchPosts } from 'store/actions/gate';
import { Loader } from '@commun/ui';
import TrendingCommunities from 'components/common/TrendingCommunities';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import PostCard from '../PostCard';
import CTARegistration from '../CTA/CTARegistration';
import CTAReferralProgram from '../CTA/CTAReferralProgram';

const Block = styled.div`
  min-height: 200px;
  padding: 20px;
  background: #fff;
`;

const ErrorBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #f00;
`;

const ErrorMessage = styled.div``;

const EmptyBlock = styled(Block)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  font-size: 24px;
  font-weight: bold;
  color: #ddd;
  background: #fff;

  ${up('tablet')} {
    border-radius: 6px;
  }
`;

const Retry = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 14px 2px;
  margin-top: 8px;
  border-radius: 17px;
  color: #fff;
  background: ${({ theme }) => theme.colors.contextBlue};
`;

const LoaderStyled = styled(Loader)`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

export default class PostList extends PureComponent {
  static async getInitialProps({ store, params }) {
    try {
      await store.dispatch(fetchPosts(params));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Fetching posts failed:', err);
    }

    return {
      queryParams: params,
    };
  }

  static propTypes = {
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    fetchError: PropTypes.shape({}),
    isLoading: PropTypes.bool.isRequired,
    isOneColumnMode: PropTypes.bool.isRequired,
    isAllowLoadMore: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,
    fetchPosts: PropTypes.func.isRequired,
    queryParams: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    sequenceKey: null,
    fetchError: null,
  };

  state = {
    items: this.generateItemsList(),
  };

  componentDidMount() {
    const { fetchError } = this.props;

    if (fetchError) {
      this.fetchPostsSafe();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { order, isOneColumnMode } = this.props;

    if (order !== nextProps.order || isOneColumnMode !== nextProps.isOneColumnMode) {
      this.setState({
        items: this.generateItemsList(nextProps),
      });
    }
  }

  checkLoadMore = () => {
    const { isAllowLoadMore, queryParams, sequenceKey } = this.props;

    if (!isAllowLoadMore) {
      return;
    }

    this.fetchPostsSafe({
      ...queryParams,
      sequenceKey,
    });
  };

  onRetryClick = () => {
    this.fetchPostsSafe();
  };

  fetchPostsSafe(params) {
    const { queryParams, fetchPosts } = this.props;

    fetchPosts(params || queryParams).catch(err => {
      // TODO: Add toastr with error
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }

  generateItemsList(props = this.props) {
    const {
      order,
      // isOneColumnMode
    } = props;

    const items = [];

    for (let i = 0; i < order.length; i += 1) {
      const id = order[i];

      // if ((i + 3) % 5 === 0) {
      //   items.push({
      //     key: `${id}:ref`,
      //     type: 'ref',
      //   });
      // }
      //
      // if ((i + 2) % 7 === 0) {
      //   items.push({
      //     key: `${id}:reg`,
      //     type: 'reg',
      //   });
      // }
      //
      // if (isOneColumnMode && (i + 1) % 6 === 0) {
      //   items.push({
      //     key: `${id}:trend`,
      //     type: 'trend',
      //   });
      // }

      items.push({
        key: id,
        type: 'post',
        id,
      });
    }

    return items;
  }

  render() {
    const { fetchError, isLoading, isAllowLoadMore } = this.props;
    const { items } = this.state;

    if (items.length === 0) {
      if (fetchError) {
        return (
          <ErrorBlock>
            <ErrorMessage>{fetchError.message}</ErrorMessage>
            {isAllowLoadMore ? <Retry onClick={this.onRetryClick}>Retry</Retry> : null}
          </ErrorBlock>
        );
      }

      return <EmptyBlock>List is empty</EmptyBlock>;
    }

    const components = items.map(({ key, type, id }) => {
      switch (type) {
        case 'ref':
          return <CTAReferralProgram key={key} />;
        case 'reg':
          return <CTARegistration key={key} />;
        case 'trend':
          return <TrendingCommunities key={key} />;
        case 'post':
          return id ? <PostCard key={key} postId={id} /> : null;
        default:
          throw new Error('Invariant');
      }
    });

    return (
      <InfinityScrollHelper disabled={!isAllowLoadMore} onNeedLoadMore={this.checkLoadMore}>
        {components}
        {isLoading ? <LoaderStyled /> : null}
      </InfinityScrollHelper>
    );
  }
}
