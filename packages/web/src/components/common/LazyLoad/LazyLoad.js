import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useVisibility } from 'utils/hooks';

const Wrapper = styled.div`
  display: flex;
  min-height: ${({ height }) => height}px;
`;

function LazyLoad({ height, offset, children, ...props }) {
  const viewportRef = useRef();
  const isVisible = useVisibility(viewportRef, { rootMargin: `0px 0px ${offset}px 0px` }, true);

  if (isVisible) {
    return children;
  }

  return <Wrapper ref={viewportRef} height={height} {...props} />;
}

LazyLoad.propTypes = {
  height: PropTypes.number,
  offset: PropTypes.number,
};

LazyLoad.defaultProps = {
  height: 280,
  offset: 300,
};

export default LazyLoad;
