import React, { PureComponent } from 'react';

import PostList from 'components/PostList';

export default class UserFeed extends PureComponent {
  static async getInitialProps({ query, store }) {
    const props = await PostList.getInitialProps({
      store,
      params: {
        type: 'user',
        id: query.userId,
      },
    });

    return {
      ...props,
      namespacesRequired: [],
    };
  }

  render() {
    return <PostList {...this.props} />;
  }
}
