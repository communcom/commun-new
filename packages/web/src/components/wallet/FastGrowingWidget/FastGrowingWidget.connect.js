import { connect } from 'react-redux';
import FastGrowingWidget from './FastGrowingWidget';

export default connect(() => {
  // TODO: replace width real data
  const points = [
    {
      name: 'COMMUN',
      communityId: 'gls',
      count: 1000.23,
    },
    {
      name: 'Overwatch',
      communityId: 'overwatch',
      count: 500,
    },
    {
      name: 'ADME',
      communityId: 'adme',
      count: 230,
    },
    {
      name: 'Dribble',
      communityId: 'dribble',
      count: 999,
    },
    {
      name: 'Behance',
      communityId: 'behance',
      count: 999,
    },
  ];

  return {
    points,
  };
})(FastGrowingWidget);
