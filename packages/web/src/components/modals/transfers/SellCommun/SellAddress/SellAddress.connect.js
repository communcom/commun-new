import { connect } from 'react-redux';

import { transfer } from 'store/actions/commun';
import { payMirSellCMN, waitForTransaction } from 'store/actions/gate';

import SellAddress from './SellAddress';

export default connect(null, { payMirSellCMN, transfer, waitForTransaction })(SellAddress);
