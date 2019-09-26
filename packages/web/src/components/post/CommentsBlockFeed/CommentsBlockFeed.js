import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import is from 'styled-is';

import { Link } from 'shared/routes';
import { Loader, TabHeader } from '@commun/ui';
import { Icon } from '@commun/icons';
import { contentIdType } from 'types/common';
import Avatar from 'components/Avatar';
import CommentForm from 'components/CommentForm';

import Filter from '../CommentsBlock/Filter';
import CommentsList from '../CommentList';

const Wrapper = styled.section`
  padding-top: 20px;

  ${is('inFeed')`
    padding: 0 15px 15px;
  `}
`;

const Header = styled.div`
  padding: 16px 0;

  ${up('desktop')} {
    padding: 0 0 12px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 35px 0;

  ${is('inFeed')`
    margin: 15px 0 0;
  `};
`;

const CommentFormStyled = styled(CommentForm)`
  margin-left: 16px;
`;

const IconPhoto = styled(Icon).attrs({
  name: 'photo',
})`
  cursor: pointer;
  width: 19px;
  height: 19px;
  margin-left: 8px;
`;

const AllCommentsLink = styled.a`
  display: flex;
  margin-top: 10px;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.contextBlue};
`;

const LoaderStyled = styled(Loader)`
  color: ${({ theme }) => theme.colors.contextBlue};
`;

export default class CommentsBlock extends PureComponent {
  static propTypes = {
    contentId: contentIdType.isRequired,
    loggedUserId: PropTypes.string,
    totalCommentsCount: PropTypes.number,
    order: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentsFilter: PropTypes.func.isRequired,
    filterSortBy: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    inFeed: PropTypes.bool,
    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
    totalCommentsCount: null,
    inFeed: false,
  };

  async componentDidMount() {
    const { contentId, filterSortBy: sortBy, fetchPostComments } = this.props;

    try {
      await fetchPostComments({
        contentId,
        sortBy,
        limit: 3,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  componentDidUpdate(prevProps) {
    const { contentId, filterSortBy: sortBy, fetchPostComments } = this.props;

    if (prevProps.filterSortBy !== sortBy) {
      try {
        fetchPostComments({
          contentId,
          sortBy,
          limit: 3,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  }

  renderForm() {
    const { loggedUserId, contentId, inFeed } = this.props;

    if (!loggedUserId) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return (
      <InputWrapper inFeed={inFeed}>
        <Avatar userId={loggedUserId} useLink />
        <CommentFormStyled inPost contentId={contentId} />
        <IconPhoto />
      </InputWrapper>
    );
  }

  render() {
    const {
      contentId,
      order,
      totalCommentsCount,
      filterSortBy,
      isLoading,
      setCommentsFilter,
      inFeed,
    } = this.props;

    return (
      <Wrapper inFeed={inFeed}>
        <Header>
          <HeaderTop>
            {!inFeed ? <TabHeader title="Comments" quantity={totalCommentsCount} /> : null}
            <Filter filterSortBy={filterSortBy} setCommentsFilter={setCommentsFilter} />
          </HeaderTop>
        </Header>
        {!inFeed ? this.renderForm() : null}
        <Body>
          <CommentsList order={order} isLoading={isLoading} inFeed />
          {isLoading ? <LoaderStyled /> : null}
        </Body>
        {inFeed && totalCommentsCount ? (
          <Link route="post" params={contentId} hash="comments" passHref>
            <AllCommentsLink>Show all comments</AllCommentsLink>
          </Link>
        ) : null}
        {inFeed ? this.renderForm() : null}
      </Wrapper>
    );
  }
}
