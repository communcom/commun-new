import { connect } from 'react-redux';

import { payMirExchange, waitForTransaction } from 'store/actions/gate';
import { transfer } from 'store/actions/commun';

import SellAddress from './SellAddress';

export default connect(null, { payMirExchange, transfer, waitForTransaction })(SellAddress);
