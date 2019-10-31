import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { extendedPostType } from 'types/common';
import CardCommunityHeader from 'components/common/CardCommunityHeader';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import { PostLink } from 'components/links';

export default class PostCardHeader extends Component {
  static propTypes = {
    post: extendedPostType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    report: PropTypes.func.isRequired,
    onPostClick: PropTypes.func.isRequired,
    onPostEditClick: PropTypes.func.isRequired,
  };

  onReportClick = () => {
    const { post, report } = this.props;
    report(post.contentId);
  };

  render() {
    const { post, isOwner, onPostClick, onPostEditClick } = this.props;
    const { community, author } = post;

    return (
      <CardCommunityHeader
        community={community}
        user={author}
        linkify={content => <PostLink post={post}>{content}</PostLink>}
        time={post.meta.creationTime}
        onTimeClick={onPostClick}
        menuItems={() => (
          <>
            {isOwner ? (
              <DropDownMenuItem name="post-card__edit-post" onClick={onPostEditClick}>
                Edit
              </DropDownMenuItem>
            ) : (
              <DropDownMenuItem name="post-card__report" onClick={this.onReportClick}>
                Report
              </DropDownMenuItem>
            )}
          </>
        )}
      />
    );
  }
}
