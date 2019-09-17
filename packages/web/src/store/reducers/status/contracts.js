import {
  DEPLOY_CONTRACT,
  DEPLOY_CONTRACT_SUCCESS,
  DEPLOY_CONTRACT_ERROR,
  INIT_CONTRACTS,
  INIT_CONTRACTS_SUCCESS,
  INIT_CONTRACTS_ERROR,
} from 'store/constants/actionTypes';

const STATUSES = {
  PENDING: 'pending',
  DEPLOYING: 'deploying',
  DONE: 'done',
  ERROR: 'error',
};

const initialState = {
  contractTypes: {
    ctrl: STATUSES.PENDING,
    emit: STATUSES.PENDING,
    publish: STATUSES.PENDING,
    social: STATUSES.PENDING,
    charge: STATUSES.PENDING,
  },
  errors: {
    ctrl: null,
    emit: null,
    publish: null,
    social: null,
    charge: null,
  },
  initContracts: STATUSES.PENDING,
};

export default function(state = initialState, { type, meta, error }) {
  switch (type) {
    case DEPLOY_CONTRACT:
      return {
        ...state,
        contractTypes: {
          ...state.contractTypes,
          [meta.contractType]: STATUSES.DEPLOYING,
        },
        errors: {
          ...state.errors,
          [meta.contractType]: null,
        },
      };
    case DEPLOY_CONTRACT_SUCCESS:
      return {
        ...state,
        contractTypes: {
          ...state.contractTypes,
          [meta.contractType]: STATUSES.DONE,
        },
      };
    case DEPLOY_CONTRACT_ERROR:
      return {
        ...state,
        contractTypes: {
          ...state.contractTypes,
          [meta.contractType]: STATUSES.ERROR,
        },
        errors: {
          ...state.errors,
          [meta.contractType]: error.json.error,
        },
      };

    case INIT_CONTRACTS:
      return {
        ...state,
        initContracts: STATUSES.DEPLOYING,
      };
    case INIT_CONTRACTS_SUCCESS:
      return {
        ...state,
        initContracts: STATUSES.DONE,
      };
    case INIT_CONTRACTS_ERROR:
      return {
        ...state,
        initContracts: STATUSES.ERROR,
      };

    default:
      return state;
  }
}
