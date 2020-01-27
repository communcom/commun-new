import { connect } from 'react-redux';

import { quickSearch } from 'store/actions/gate';

import SearchPanel from './SearchPanel';

export default connect(null, { quickSearch })(SearchPanel);
