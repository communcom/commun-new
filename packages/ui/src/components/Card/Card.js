import styled from 'styled-components';

import { up } from '../../utils/mediaQuery';

export default styled.section`
  background-color: ${({ theme }) => theme.colors.white};

  ${up.tablet} {
    border-radius: 6px;
  }
`;
