import styled from 'styled-components';

import { Button, PaginationLoader, up } from '@commun/ui';

import CommunityRow from 'components/common/CommunityRow';
import { Filter } from 'components/common/filters/common/Filter.styled';
import SearchInput from 'components/common/SearchInput';

export const Wrapper = styled.div``;

export const SearchInputStyled = styled(SearchInput)`
  margin-bottom: 20px;
`;

export const Items = styled.ul`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(1, [col-start] minmax(0, 1fr));

  ${up.mobileLandscape} {
    grid-template-columns: repeat(2, [col-start] minmax(0, 1fr));
  }

  ${up.tablet} {
    grid-template-columns: repeat(1, [col-start] minmax(0, 1fr));
  }
`;

export const CommunityRowStyled = styled(CommunityRow)`
  padding: 0;
`;

export const PaginationLoaderStyled = styled(PaginationLoader)`
  padding-bottom: 20px;
`;

export const BigButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  appearance: none;
`;

export const FilterStyled = styled(Filter)`
  border-radius: 0 70px 70px 0;
`;
