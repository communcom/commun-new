import styled from 'styled-components';

import { CONTAINER_MAX_WIDTH, CONTAINER_OUTER_WIDTH, CONTAINER_DESKTOP_PADDING } from 'constants';
import { up } from '../../utils/mediaQuery';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  max-width: 100%;
  width: 100%;
  padding: 0;
  margin: 0 auto;

  ${up.tablet} {
    padding: 20px;
  }

  ${up.desktop} {
    padding: ${CONTAINER_DESKTOP_PADDING}px;
  }

  @media (min-width: ${CONTAINER_OUTER_WIDTH}px) {
    max-width: ${CONTAINER_MAX_WIDTH}px;
    padding: 24px 0;
  }
`;

export default MainContainer;
