import PropTypes from 'prop-types';

export default function AbSwitcher({ abValue, children }) {
  return children(abValue);
}

AbSwitcher.propTypes = {
  test: PropTypes.object.isRequired,
  abValue: PropTypes.string,
};

AbSwitcher.defaultProps = {
  abValue: null,
};
