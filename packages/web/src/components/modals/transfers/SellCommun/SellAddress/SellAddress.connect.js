import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { payMirExchange, waitForTransaction } from 'store/actions/gate';

import SellAddress from './SellAddress';

export default connect(null, { payMirExchange, transfer, waitForTransaction })(SellAddress);
