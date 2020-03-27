// import dynamic from 'next/dynamic';

export default [
  {
    id: 1,
    // TODO: card for coommuntities row
    // component: dynamic(() => import('components/faq/sections/CommunitiesRow')),
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
    children: [
      {
        id: 41,
        imageUrl: '/images/pages/faq/section-like-posts.png',
      },
      {
        id: 42,
        imageUrl: '/images/pages/faq/section-buy-points.png',
      },
      {
        id: 43,
        imageUrl: '/images/pages/faq/section-become-leader.png',
      },
    ],
  },
  {
    id: 5,
    children: [
      {
        id: 51,
        imageUrl: '/images/pages/faq/section-create-posts.png',
      },
      {
        id: 52,
      },
      {
        id: 53,
        imageUrl: '/images/pages/faq/section-become-leader.png',
      },
      {
        id: 54,
        imageUrl: '/images/pages/faq/section-buy-points.png',
      },
    ],
  },
  {
    id: 6,
  },
];
