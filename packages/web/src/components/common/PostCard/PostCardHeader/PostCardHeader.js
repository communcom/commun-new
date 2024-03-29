import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { extendedPostType } from 'types/common';
import { withTranslation } from 'shared/i18n';

import CardCommunityHeader from 'components/common/CardCommunityHeader';
import { DropDownMenuItem } from 'components/common/DropDownMenu';
import { PostLink } from 'components/links';
import ExplorerTransactionMenuItem from 'components/pages/post/ExplorerTransactionMenuItem';

@withTranslation()
export default class PostCardHeader extends Component {
  static propTypes = {
    post: extendedPostType.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isLeader: PropTypes.bool.isRequired,
    isReport: PropTypes.bool,
    isHideMenu: PropTypes.bool,
    disableLink: PropTypes.bool.isRequired,

    onPostClick: PropTypes.func.isRequired,
    onPostEditClick: PropTypes.func.isRequired,
    onPostDeleteClick: PropTypes.func.isRequired,
    openReportModal: PropTypes.func.isRequired,
    checkAuth: PropTypes.func.isRequired,
    createBanPostProposalIfNeeded: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isHideMenu: false,
    isReport: false,
  };

  onReportClick = async () => {
    const { post, checkAuth, openReportModal } = this.props;

    try {
      await checkAuth({ allowLogin: true });
    } catch {
      return;
    }

    openReportModal(post.contentId);
  };

  onBanClick = async () => {
    const { post, createBanPostProposalIfNeeded } = this.props;
    createBanPostProposalIfNeeded(post);
  };

  render() {
    const {
      post,
      isOwner,
      isLeader,
      isHideMenu,
      isReport,
      disableLink,
      t,
      onPostClick,
      onPostEditClick,
      onPostDeleteClick,
    } = this.props;
    const { community, author } = post;

    return (
      <CardCommunityHeader
        post={post}
        community={community}
        user={author}
        linkify={disableLink ? null : content => <PostLink post={post}>{content}</PostLink>}
        time={post.meta.creationTime}
        onTimeClick={onPostClick}
        isReport={isReport}
        menuItems={
          isHideMenu
            ? null
            : () => (
                <>
                  {isOwner ? (
                    <>
                      <DropDownMenuItem name="post-card__edit-post" onClick={onPostEditClick}>
                        {t('common.edit')}
                      </DropDownMenuItem>
                      <DropDownMenuItem name="post-card__delete-post" onClick={onPostDeleteClick}>
                        {t('common.delete')}
                      </DropDownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropDownMenuItem name="post-card__report" onClick={this.onReportClick}>
                        {t('menu.post.report')}
                      </DropDownMenuItem>
                      {isLeader ? (
                        <DropDownMenuItem name="post-card__ban" onClick={this.onBanClick}>
                          {t('menu.post.propose_ban')}
                        </DropDownMenuItem>
                      ) : null}
                    </>
                  )}
                  <ExplorerTransactionMenuItem meta={post.meta} />
                </>
              )
        }
      />
    );
  }
}
