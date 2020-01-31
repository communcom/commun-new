import styled from 'styled-components';

import { up } from '@commun/ui';

import UserRow from 'components/common/UserRow';
import CommunityRow from 'components/common/CommunityRow';

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
