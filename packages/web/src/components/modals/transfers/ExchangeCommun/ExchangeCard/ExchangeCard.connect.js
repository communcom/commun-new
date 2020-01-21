import { connect } from 'react-redux';

import { addCard, chargeCard } from 'store/actions/gate';

import ExchangeCard from './ExchangeCard';

export default connect(
  null,
  {
    addCard,
    chargeCard,
  }
)(ExchangeCard);
