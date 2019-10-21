import styled from 'styled-components';

import { up } from '@commun/ui';

export default styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100%;
  min-width: 56px;
  padding: 10px;
  color: #000;

  ${up.tablet} {
    padding: 20px;
  }

  ${up.desktop} {
    min-width: 64px;
    transition: background-color 0.15s;

    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
`;
