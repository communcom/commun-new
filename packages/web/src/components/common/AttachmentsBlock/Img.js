import styled from 'styled-components';
import is from 'styled-is';

export default styled.img`
  display: block;
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
  cursor: pointer;

  ${is('isComment')`
    max-height: 250px;
    width: auto;
  `};
`;
