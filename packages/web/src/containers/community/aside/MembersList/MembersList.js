import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { Card } from '@commun/ui';
import UsersList from 'containers/community/UsersList';

import CardHeader from '../CardHeader';

const Wrapper = styled(Card)`
  width: 328px;
  height: 244px;
`;

const CustomIcon = styled(Icon).attrs({ name: 'search' })``;

const SearchFiled = styled.div`
  margin-top: 21px;
  width: 296px;
  height: 44px;
  padding: 15px 17px;
  background: #f9f9f9;
  border-radius: 4px;
`;

const SearchText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 18px;
  letter-spacing: -0.41px;
  color: ${({ theme }) => theme.colors.contextGrey};
`;

export default class MembersList extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    communityId: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      })
    ).isRequired,
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  render() {
    const { members, isEnd, isLoading } = this.props;

    if (!members.length) {
      return null;
    }

    return (
      <Wrapper>
        <CardHeader headerText={`${members.length} members`} />
        <UsersList items={members.slice(0, 6)} isEnd={isEnd} isLoading={isLoading} isCompact />
        <CardHeader headerText="ADD New Member" />
        <SearchFiled>
          <SearchText>
            <CustomIcon />
            Enter name or e-mail adress
          </SearchText>
        </SearchFiled>
      </Wrapper>
    );
  }
}
