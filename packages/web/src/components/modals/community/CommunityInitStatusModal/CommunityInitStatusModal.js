import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { keys } from 'ramda';

import { Panel } from '@commun/ui';

import { Button, ParamGroup } from 'components/common/prototyping';

const ActionStatus = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 5px;
`;

const ContractName = styled.span`
  margin-right: 15px;
`;

const Action = styled.div``;

const Status = styled.div``;

const RetryButton = styled(Button)`
  margin-top: 0;
  padding: 0 15px;
`;

export default class CommunityInitStatusModal extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({}).isRequired,
    accounts: PropTypes.shape({}).isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
    contractTypes: PropTypes.shape({}).isRequired,
    initContracts: PropTypes.string.isRequired,
    errors: PropTypes.shape({}).isRequired,
    createCommunity: PropTypes.func.isRequired,
    retryCloneContract: PropTypes.func.isRequired,
  };

  renderStatus = () => {
    const { contractTypes, accounts, errors } = this.props;
    const deployStatuses = [];
    for (const contract of keys(contractTypes)) {
      const contractName = accounts[contract];
      let status = contractTypes[contract];

      if (errors[contract] !== null) {
        status = (
          <RetryButton onClick={this.handleRetryButtonClick(contractName, contract)}>
            Retry
          </RetryButton>
        );
      }

      deployStatuses.push(
        <ActionStatus key={contract}>
          <Action>
            <ContractName>{contractName}</ContractName>
            {contract}
          </Action>
          <Status>{status}</Status>
        </ActionStatus>
      );
    }
    return deployStatuses;
  };

  handleRetryButtonClick = (contractName, contractType) => () => {
    const { retryCloneContract } = this.props;

    retryCloneContract(contractName, contractType);
  };

  handleButtonClick = () => {
    const { params, createCommunity, publicKeys } = this.props;

    createCommunity(params, publicKeys);
  };

  render() {
    const { initContracts } = this.props;
    return (
      <Panel title="Create community status ">
        <ParamGroup title="Deploying contracts">{this.renderStatus()}</ParamGroup>
        <ParamGroup title="Init contracts">
          <ActionStatus>
            <Action>Set params</Action>
            <Status>{initContracts}</Status>
          </ActionStatus>
        </ParamGroup>
        <Button onClick={this.handleButtonClick}>Create</Button>
      </Panel>
    );
  }
}
