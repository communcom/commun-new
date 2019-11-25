/* eslint-disable react/require-default-props */

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@commun/ui';

import AsyncAction from 'components/common/AsyncAction';

export default function AsyncButton({ isProcessing, onClick, ...props }) {
  return (
    <AsyncAction isProcessing={isProcessing} onClickHandler={onClick}>
      <Button {...props} />
    </AsyncAction>
  );
}

AsyncButton.propTypes = {
  isProcessing: PropTypes.bool,
  onClick: PropTypes.func,
};
