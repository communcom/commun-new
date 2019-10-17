import { connect } from 'react-redux';
import FastGrowingWidget from './FastGrowingWidget';

export default connect(() => {
  // TODO: replace width real data
  const points = [
    {
      name: 'COMMUN',
      communityId: 'gls',
      communityAlias: 'id123',
      count: 1000.23,
    },
    {
      name: 'Overwatch',
      communityId: 'overwatch',
      communityAlias: 'id123',
      count: 500,
    },
    {
      name: 'ADME',
      communityId: 'adme',
      communityAlias: 'id123',
      count: 230,
    },
    {
      name: 'Dribble',
      communityId: 'dribble',
      communityAlias: 'id123',
      count: 999,
    },
    {
      name: 'Behance',
      communityId: 'behance',
      communityAlias: 'id123',
      count: 999,
    },
  ];

  return {
    points,
  };
})(FastGrowingWidget);
