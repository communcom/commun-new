import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { SHOW_MODAL_SET_CONTRACTS_KEYS } from 'store/constants/modalTypes';

import { CreateCommunityForm } from 'components/community';

export default class CreateCommunity extends PureComponent {
  static propTypes = {
    openModal: PropTypes.func.isRequired,
  };

  onSubmit = values => {
    const { openModal } = this.props;
    openModal(SHOW_MODAL_SET_CONTRACTS_KEYS, { params: values, accounts: values.accounts });
  };

  render() {
    return <CreateCommunityForm onSubmit={this.onSubmit} />;
  }
}
