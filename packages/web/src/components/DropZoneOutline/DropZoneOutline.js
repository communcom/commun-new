import styled from 'styled-components';
import is from 'styled-is';

const DropZoneOutline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(200, 200, 200, 0.3);
  pointer-events: none;

  ${is('active')`
    &::after {
      position: absolute;
      content: '';
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      border: 2px dashed #aaa;

      ${is('round')`
        border-radius: 50%;
      `};
    }
  `};
`;

export default DropZoneOutline;
