/* eslint camelcase: ["error", {ignoreDestructuring: true, properties: "never"}] */

import { keys, sortBy, prop } from 'ramda';
import cyber from 'cyber-client';

import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  DEPLOY_CONTRACT,
  DEPLOY_CONTRACT_SUCCESS,
  DEPLOY_CONTRACT_ERROR,
  INIT_CONTRACTS,
  INIT_CONTRACTS_SUCCESS,
  INIT_CONTRACTS_ERROR,
} from 'store/constants/actionTypes';

const CONTRTACTS = {
  ctrl: 'gls.ctrl',
  emit: 'gls.emit',
  publish: 'gls.publish',
  social: 'gls.social',
  charge: 'gls.charge',
};

const VESTING_CONTRACT = 'gls.vesting';

const symbolType = (precision, symbol) => `${precision},${symbol}`;

// TODO not completed yet
export const setContractsKeys = contractsKeys => () => {
  cyber.initProvider(contractsKeys);
};

export const cloneContract = (actorName, contractType, fromContract) => ({
  [COMMUN_API]: {
    types: [DEPLOY_CONTRACT, DEPLOY_CONTRACT_SUCCESS, DEPLOY_CONTRACT_ERROR],
    contract: 'cyber',
    method: 'cloneContract',
    actorName,
    params: { fromContract },
  },
  meta: { contractType },
});

export const retryCloneContract = (actorName, contractType) => async dispatch => {
  dispatch(cloneContract(actorName, contractType, CONTRTACTS[contractType]));
};

function createAuthority(pubKeys, contractAccounts) {
  const keysList = [];
  const accountsList = [];

  for (const key of pubKeys) {
    keysList.push({ weight: 1, key });
  }

  for (const acc of contractAccounts) {
    const d = acc.split('@');
    if (d.length === 1) {
      d.push('active');
    }
    accountsList.push({ weight: 1, permission: { actor: d[0], permission: d[1] } });
  }
  return { threshold: 1, keys: keysList, accounts: accountsList, waits: [] };
}

function updateAuthAction(accountName, permission, parent, pubKeys, accounts) {
  return cyber.basic.prepareAction(
    'cyber',
    'updateauth',
    { accountName },
    {
      account: accountName,
      permission,
      parent,
      auth: createAuthority(pubKeys, accounts),
    }
  );
}

export const createCommunity = (params, publicKeys) => async dispatch => {
  const {
    accounts,
    vestingPrecision = 6,
    tokenPrecision = 3,
    ticker,
    emit,
    ctrl,
    publish,
    limits,
  } = params;

  for (const contractType of keys(CONTRTACTS)) {
    const actorName = accounts[contractType];
    dispatch(cloneContract(actorName, contractType, CONTRTACTS[contractType]));
  }

  const createVestingAction = cyber.basic.prepareAction(
    VESTING_CONTRACT,
    'createvest',
    { accountName: accounts.issuer },
    {
      symbol: symbolType(vestingPrecision, ticker),
      notify_acc: accounts.ctrl,
    }
  );

  const openTokenBalanceActions = [];

  for (const acc of keys(accounts)) {
    const accountName = accounts[acc];
    const action = cyber.basic.prepareAction(
      'cyber.token',
      'open',
      { accountName },
      {
        owner: accountName,
        symbol: symbolType(tokenPrecision, ticker),
        ram_payer: accountName,
      }
    );
    openTokenBalanceActions.push(action);
  }

  const pools = sortBy(prop('name'), [
    { name: VESTING_CONTRACT, percent: emit.reward_pools.vesting_percent },
    { name: accounts.ctrl, percent: emit.reward_pools.ctrl_percent },
    { name: accounts.publish, percent: emit.reward_pools.publish_percent },
  ]);

  const emitSetParamsAction = cyber.basic.prepareAction(
    accounts.emit,
    'setparams',
    { accountName: accounts.emit },
    {
      params: [
        ['inflation_rate', emit.infltaion],
        [
          'reward_pools',
          {
            pools,
          },
        ],
      ],
    }
  );

  const ctrlSetParamsAction = cyber.basic.prepareAction(
    accounts.ctrl,
    'setparams',
    { accountName: accounts.ctrl },
    {
      params: [
        ['ctrl_token', { code: ticker }],
        ['multisig_acc', { name: accounts.issuer }],
        ['max_witnesses', { max: ctrl.max_witnesses }],
        ['multisig_perms', ctrl.multisig_perms],
        ['max_witness_votes', { max: ctrl.max_witness_votes }],
      ],
    }
  );

  const publishSetParamsAction = cyber.basic.prepareAction(
    accounts.publish,
    'setparams',
    { accountName: accounts.publish },
    {
      params: [
        ['st_max_vote_changes', { value: publish.max_vote_changes }],
        ['st_cashout_window', publish.cashout_window],
        ['st_max_beneficiaries', { value: publish.max_beneficiaries }],
        ['st_max_comment_depth', { value: publish.max_comment_depth }],
        ['st_social_acc', { value: accounts.social }],
        ['st_referral_acc', { value: '' }],
      ],
    }
  );

  const publishSetRulesAction = cyber.basic.prepareAction(
    accounts.publish,
    'setrules',
    { accountName: accounts.publish },
    {
      mainfunc: publish.mainfunc,
      curationfunc: publish.curationfunc,
      timepenalty: publish.timepenalty,
      curatorsprop: publish.curatorsprop,
      maxtokenprop: publish.maxtokenprop,
      tokensymbol: symbolType(vestingPrecision, ticker),
    }
  );

  const publishLimitsActions = [];

  for (const limit of keys(limits)) {
    const { charge_id, price, cutoff, vesting_price, min_vesting } = limits[limit];
    publishLimitsActions.push(
      cyber.basic.prepareAction(
        accounts.publish,
        'setlimit',
        { accountName: accounts.publish },
        {
          act: limit,
          token_code: symbolType(vestingPrecision, ticker),
          charge_id,
          price,
          cutoff,
          vesting_price,
          min_vesting,
        }
      )
    );
  }

  const multisigPermsActions = [
    updateAuthAction(
      publicKeys.issuer.contractName,
      'witn.major',
      'active',
      [publicKeys.issuer.publicKey],
      []
    ),
    updateAuthAction(
      publicKeys.issuer.contractName,
      'witn.minor',
      'active',
      [publicKeys.issuer.publicKey],
      []
    ),
    updateAuthAction(
      publicKeys.issuer.contractName,
      'witn.smajor',
      'active',
      [publicKeys.issuer.publicKey],
      []
    ),
    updateAuthAction(
      publicKeys.issuer.contractName,
      'active',
      'owner',
      [publicKeys.issuer.publicKey],
      [`${publicKeys.ctrl.contractName}@cyber.code`, `${publicKeys.emit.contractName}@cyber.code`]
    ),
    updateAuthAction(
      publicKeys.ctrl.contractName,
      'active',
      'owner',
      [publicKeys.ctrl.publicKey],
      [`${publicKeys.ctrl.contractName}@cyber.code`]
    ),
    updateAuthAction(
      publicKeys.publish.contractName,
      'active',
      'owner',
      [publicKeys.publish.publicKey],
      [`${publicKeys.publish.contractName}@cyber.code`]
    ),
    updateAuthAction(
      publicKeys.social.contractName,
      'active',
      'owner',
      [publicKeys.social.publicKey],
      [`${publicKeys.publish.contractName}@cyber.code`]
    ),
    updateAuthAction(
      publicKeys.emit.contractName,
      'active',
      'owner',
      [publicKeys.emit.publicKey],
      [`${publicKeys.emit.contractName}@cyber.code`]
    ),
  ];

  const initActions = [
    createVestingAction,
    ...openTokenBalanceActions,
    emitSetParamsAction,
    ctrlSetParamsAction,
    publishSetParamsAction,
    publishSetRulesAction,
    ...publishLimitsActions,
    ...multisigPermsActions,
  ];

  dispatch({
    [COMMUN_API]: {
      types: [INIT_CONTRACTS, INIT_CONTRACTS_SUCCESS, INIT_CONTRACTS_ERROR],
      contract: 'basic',
      method: 'sendActions',
      params: initActions,
    },
  });
};
