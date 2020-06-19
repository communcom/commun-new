import { createFlopflipReducer, FLOPFLIP_STATE_SLICE } from '@flopflip/react-redux';
import { combineReducers } from 'redux';
import { modalsReducer as modals } from 'redux-modals-manager';
import optimist from 'redux-optimist';

import defaultFlags from 'shared/featureFlags';

import data from './data';
import entities from './entities';
import status from './status';
import ui from './ui';

export default optimist(
  combineReducers({
    data,
    entities,
    status,
    ui,
    modals,
    [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(defaultFlags),
  })
);
