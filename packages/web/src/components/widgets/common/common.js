import styled from 'styled-components';

import { up } from '@commun/ui';
import { RIGHT_SIDE_BAR_WIDTH } from 'shared/constants';

export const WidgetCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0 8px;
  border-radius: 6px;
  background-color: #fff;

  ${up.tablet} {
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
  }
`;

export const WidgetTitle = styled.h4`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.colors.contextBlack};
`;
