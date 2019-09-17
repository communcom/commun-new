import React from 'react';
import PropTypes from 'prop-types';
import isPropValid from '@emotion/is-prop-valid';

const Icon = ({ name, size, height, width, ...props }) => {
  const filteredProps = {};

  Object.keys(props).forEach(prop => {
    if (isPropValid(prop)) {
      filteredProps[prop] = props[prop];
    }
  });

  return (
    <svg {...filteredProps} height={size || height} width={size || width}>
      <use xlinkHref={`#${name}-icon`} />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Icon.defaultProps = {
  size: '',
  height: 16,
  width: 16,
};

export default Icon;
