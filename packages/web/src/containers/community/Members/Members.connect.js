import { connect } from 'react-redux';

import Members from './Members';

export default connect(() => {
  // TODO: replace width real data
  const members = [
    {
      username: 'nickshtefan',
      name: 'Nick Shtefan',
    },
    {
      username: 'joseph.kalu',
      name: 'Joseph Kalu',
    },
    {
      username: 'destroyer2k',
      name: 'John Doe',
    },
    {
      username: 'john.doe',
      name: 'John Doe',
    },
    {
      username: 'john.malkovich',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich1',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich2',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich3',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich4',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich5',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich6',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich7',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich8',
      name: 'John Malkovich',
    },
    {
      username: 'john.malkovich9',
      name: 'John Malkovich',
    },
  ];

  return {
    members,
  };
})(Members);
