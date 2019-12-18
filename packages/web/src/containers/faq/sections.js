// import dynamic from 'next/dynamic';

export default [
  {
    id: 1,
    title: 'Community and Points',
    description:
      'Each community has own Points. They serve as an analog for currency inside every community.',
    // TODO: card for coommuntities row
    // component: dynamic(() => import('components/faq/sections/CommunitiesRow')),
  },
  {
    id: 2,
    title: 'How do you get Points',
    description:
      "You can get them in several ways, and involving money isn't necessary at all. Create or share posts, like and comment them, become the leader of the community.",
    children: [
      {
        id: 21,
        title: 'Create posts',
        description:
          'This is one of the most solid ways to get your Points. Creators of publications that become trending are rewarded in the ratio of 45% of the total post’s income. The rest 45% goes to curators (ones who liked or commented on the post) and 5% to the leaders of the community.',
        imageUrl: '/images/pages/faq/section-create-posts.png',
      },
      {
        id: 22,
        title: 'Comment',
        description:
          'Comments are quite similar to post. In the sense that every comment that goes to the "top 10 of the day" brings income to a commenter in the same ratio as described above in the "Create posts" section - 45% to the commenter, 45% to ones who liked it, the rest 5% goes to the leaders.',
        imageUrl: '/images/pages/faq/section-comment.png',
      },
      {
        id: 23,
        title: 'Buy Points with Commun',
        description:
          'Commun token is the unifying currency that interchanges with all the Community Points in Commun. You can buy Points with it, depending on the value of the particular Community Point. You can do it converting Points of one community into Commun token and then purchase Points of another one. Or you can simply buy them with your own money. It’s easier than it seems.',
        imageUrl: '/images/pages/faq/section-buy-points.png',
      },
    ],
  },
  {
    id: 3,
    title: 'What can you do with Points',
    description:
      'Points serve as a medium of evaluation. Meaning you can spend them liking posts and comments or changing them to general Commun token, which then can be converted to Points of your other communities or exchanged to cryptocurrencies straight in the wallet.',
    children: [
      {
        id: 31,
        title: 'Like posts',
        description:
          ' Use Points to evaluate the content. It’s you who decide what deserves the attention.',
        imageUrl: '/images/pages/faq/section-like-posts.png',
      },
      {
        id: 32,
        title: 'Exchange Points',
        description:
          'You can transfer your Points among communities via unified Commun token. Convert Points according to their price and purchase Points of another community straight in your wallet.',
        imageUrl: '/images/pages/faq/section-exchange-points.png',
      },
      {
        id: 33,
        title: 'Become the leader',
        description:
          "Every community on Commun has their scope of leaders. Community leaders are members who applied for leading positions and then approved by other members of the community through direct voting. The voting is continuous and mandate-free, thus applying is available to everyone and depends on the evaluation of their responsibilities by other members.<br/><br/>To become the leader you need to have a sufficient amount of Community Points and be supported by the votes of members. The amount of Points is significant in distributing the revenue because all the leaders' rewards are divided between them proportionally to the number of their Points on the account.",
        imageUrl: '/images/pages/faq/section-become-leader.png',
      },
    ],
  },
];
