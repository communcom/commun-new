import { connect } from 'react-redux';

import UsersLayout from './UsersLayout';

// TODO remove after implementation
const items = [
  {
    userId: 'tst5smfsyrgo',
    username: 'bednar-romeo-phd',
    avatarUrl: 'https://img.golos.io/images/3PvdiRaSMg13HrbnXVm9oV83kC8Q.png',
  },
  {
    userId: 'tst5alsfwkkd',
    username: 'paucek-pat-dds',
    avatarUrl: 'https://img.golos.io/images/2Cw3nM5dbAJT66HZF4fb95LRyEW7.png',
  },
  {
    userId: 'tst5iiqouzxn',
    username: 'creator',
    avatarUrl: 'https://img.golos.io/images/2GGvuTpvaZM1zZzP2MS16qGF6pnh.png',
  },
  {
    userId: 'tst5lryvxhsr',
    username: 'shtefan',
    avatarUrl: 'https://img.golos.io/images/H6UVkzZENqkhFQRNReKF23oLz7s.png',
  },
  {
    id: 'tst4dyjydrle',
    userId: 'tst4dyjydrle',
    username: 'lueilwitz-aracely-dds',
  },
  {
    userId: 'tst5ikacnhdx',
    username: 'degget',
    avatarUrl: 'https://img.golos.io/images/4YYK8p1D7KogAzKZqibQbBMcXh9S.png',
  },
];

export default connect(() => ({
  items,
}))(UsersLayout);
