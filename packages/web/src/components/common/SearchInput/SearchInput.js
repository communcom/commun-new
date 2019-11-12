import styled from 'styled-components';

import { Search } from '@commun/ui';

const SearchInput = styled(Search)`
  flex-grow: 1;
  border: none;
  background-color: ${({ theme }) => theme.colors.lightGrayBlue};

  & input {
    &,
    &::placeholder {
      font-size: 15px;
    }
  }
`;
export default SearchInput;
