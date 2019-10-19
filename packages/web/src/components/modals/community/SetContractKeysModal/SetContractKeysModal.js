import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { keys } from 'ramda';
import ecc from 'eosjs-ecc';

import { Panel } from '@commun/ui';

import { MODAL_CONFIRM, SHOW_MODAL_COMMUNITY_INIT_STATUS } from 'store/constants/modalTypes';

import { Button, InputGroup } from 'components/common/prototyping';

export default class SetContractKeysModal extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({}).isRequired,
    accounts: PropTypes.shape({}).isRequired,
    openModal: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    setContractsKeys: PropTypes.func.isRequired,
  };

  state = {
    privateKeys: {},
  };

  handleChangeKey = e => {
    const { value, name } = e.target;
    const { privateKeys } = this.state;

    privateKeys[name] = value;

    this.setState({
      privateKeys,
    });
  };

  renderInputs = () => {
    const { accounts } = this.props;
    return keys(accounts).map(acc => (
      <InputGroup key={acc} label={accounts[acc]} name={acc} onChange={this.handleChangeKey} />
    ));
  };

  handleButtonClick = async () => {
    const { close, openModal, params, accounts, setContractsKeys } = this.props;
    const { privateKeys } = this.state;

    const publicKeys = {};
    const contractsKeys = [];

    for (const key of keys(privateKeys)) {
      publicKeys[key] = {
        contractName: accounts[key],
        publicKey: ecc.privateToPublic(privateKeys[key], 'GLS'),
      };
      contractsKeys.push(privateKeys[key]);
    }

    setContractsKeys(contractsKeys);

    openModal(SHOW_MODAL_COMMUNITY_INIT_STATUS, { params, accounts, publicKeys });
    await close({ status: MODAL_CONFIRM });
  };

  render() {
    return (
      <Panel title="Contract accounts keys">
        {this.renderInputs()}
        <Button onClick={this.handleButtonClick}>Continue</Button>
      </Panel>
    );
  }
}
