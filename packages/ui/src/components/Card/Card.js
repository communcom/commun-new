import styled from 'styled-components';

import { up } from '../../utils/mediaQuery';

export default styled.section`
  background-color: #fff;

  ${up.tablet} {
    border-radius: 6px;
  }
`;
