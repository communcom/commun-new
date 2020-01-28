import { connect } from 'react-redux';

import { addCard, chargeCard } from 'store/actions/gate';
import { openModalExchange3DS } from 'store/actions/modals';

import ExchangeCard from './ExchangeCard';

export default connect(
  null,
  {
    addCard,
    chargeCard,
    openModalExchange3DS,
  }
)(ExchangeCard);
