import React from 'react';
import omit from 'ramda/src/omit';

/**
 * Пробрасывает ref через forwardedRef prop
 *
 * @param {string} [refName='forwardedRef']
 */
const applyRef = (refName = 'forwardedRef') => Comp => props => (
  // eslint-disable-next-line react/destructuring-assignment
  <Comp ref={props[refName]} {...omit([refName], props)} />
);

export default applyRef;
