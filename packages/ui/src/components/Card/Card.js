import styled from 'styled-components';

import { up } from '../../utils/mediaQuery';

const Card = styled.section`
  padding: 15px 16px;
  margin-bottom: 8px;
  background-color: #fff;

  ${up.tablet} {
    border: 1px solid ${({ theme }) => theme.colors.contextLightGrey};
    border-radius: 4px;
  }
`;

export default Card;
