/* eslint-disable react/require-default-props */

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@commun/ui';

import AsyncAction from 'components/common/AsyncAction';

export default function AsyncButton({ onClick, ...props }) {
  return (
    <AsyncAction onClickHandler={onClick}>
      <Button {...props} />
    </AsyncAction>
  );
}

AsyncButton.propTypes = {
  onClick: PropTypes.func,
};
