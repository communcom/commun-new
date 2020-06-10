import styled from 'styled-components';

import { up } from '@commun/ui';

import UserRow from 'components/common/UserRow';
import CommunityRow from 'components/common/CommunityRow';
import EmptyListOriginal from 'components/common/EmptyList';

export const NoResults = styled.div`
  padding: 20px 15px 22px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #999;
`;

export const UserRowStyled = styled(UserRow)`
  padding: 7px 15px;

  ${up.tablet} {
    padding: 10px 15px;
  }
`;

export const CommunityRowStyled = styled(CommunityRow)`
  padding: 7px 15px;

  ${up.tablet} {
    padding: 10px 15px;
  }
`;

export const EmptyList = styled(EmptyListOriginal)`
  ${up.desktop} {
    height: auto;
    padding: 30px 0;
    border-radius: 0 0 10px 10px;

    & > h2 {
      font-weight: 600;
      font-size: 18px;
      line-height: 21px;
    }
  }
`;
