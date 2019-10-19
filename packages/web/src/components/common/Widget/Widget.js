import styled from 'styled-components';
import { up } from 'styled-breakpoints';

import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

export default styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 0;
  border-radius: 6px;
  background-color: #fff;

  ${up('tablet')} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 16px;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.contextGrey};
`;
