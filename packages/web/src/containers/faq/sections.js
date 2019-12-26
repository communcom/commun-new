// import dynamic from 'next/dynamic';

import { DOC_WHITEPAPER_LINK } from 'shared/constants';

export default [
  {
    id: 1,
    title: 'What is Commun?',
    description:
      'Commun is a blockchain-based social media platform powering an array of user-owned independent communities. Each community is regulated by its own leaders chosen by users. The users can post, like or dislike any content within communities.',
    // TODO: card for coommuntities row
    // component: dynamic(() => import('components/faq/sections/CommunitiesRow')),
  },
  {
    id: 2,
    title: 'What is Commun Token?',
    description: `Commun token is the native token of the Commun platform that can be converted into Community Points using Bonding Curve mechanism (for more read <a href="${DOC_WHITEPAPER_LINK}" target="_blank" rel="noopener noreferrer">White Paper</a>).`,
  },
  {
    id: 3,
    title: 'What are Community Points?',
    description:
      'Each community has its own points that are distributed to its members when they post, “like” certain content items or are elected as community leaders. The points are issued at 50% inflation rate per year. Top 10 posts in each community are rewarded daily.',
  },
  {
    id: 4,
    title: 'What else can you do with the points?',
    description:
      'Points can be exchanged for Commun tokens. Tokens can be used to acquire points within other communities.',
    children: [
      {
        id: 41,
        title: 'Evaluate content',
        description:
          "Use Points to evaluate the content. You use points when you “like” somebody's post. The more likes a post receives, the more chances that it will be among the top 10 posts of the community and be rewarded. Rewards could bring additional benefits, such as author recognition or powers to moderate content.",
        imageUrl: '/images/pages/faq/section-like-posts.png',
      },
      {
        id: 42,
        title: 'Exchange Points',
        description:
          'You can convert points of your community to Commun tokens and then to points of any other community.',
        imageUrl: '/images/pages/faq/section-buy-points.png',
      },
      {
        id: 43,
        title: 'Become a leader',
        description:
          'Every community on Commun has its leaders. Community leaders are the users who applied for the leadership positions and got votes from other users. The voting process is permanent. The leaders receive rewards proportionally to the number of points they get from voting. ',
        imageUrl: '/images/pages/faq/section-become-leader.png',
      },
    ],
  },
  {
    id: 5,
    title: 'How can you get the points?',
    description: 'You can get points in several ways:',
    children: [
      {
        id: 51,
        title: 'Create posts or comment',
        description:
          'This is one of the fastest and easiest ways to get points. Those users whose posts get in the Top Ten community posts are rewarded. The content creators get 45% of daily token emissions.',
        imageUrl: '/images/pages/faq/section-create-posts.png',
      },
      {
        id: 52,
        title: 'Curate',
        description:
          'This is another fast and easy way to get points. Those users who manage “like” the the top 10 community posts are rewarded. The content curators get 45% of daily token emissions.',
      },
      {
        id: 53,
        title: 'Become a leader',
        description:
          'Three users who get most votes become leaders. The leaders get 10% of daily token emissions.',
        imageUrl: '/images/pages/faq/section-become-leader.png',
      },
      {
        id: 54,
        title: 'Get points in exchange for Commun tokens',
        description:
          'Commun token is the native token of the Commun platform that can be converted into points of different Commun communities.',
        imageUrl: '/images/pages/faq/section-buy-points.png',
      },
    ],
  },
  {
    id: 6,
    title: 'Who issues Community Points?',
    description: `Community Points for each community are issued via Bonding Curve mechanism when Commun tokens are locked. For more details read <a href="${DOC_WHITEPAPER_LINK}" target="_blank" rel="noopener noreferrer">White Paper</a>.`,
  },
];
