import styled from 'styled-components';

import { up } from '../../utils/mediaQuery';

export default styled.section`
  padding: 15px 16px;
  margin-bottom: 8px;
  background-color: #fff;

  ${up.tablet} {
    border-radius: 6px;
  }
`;
