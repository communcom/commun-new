import React from 'react';
import { HighlightedWord } from './common';

export const mobileSections = [
  {
    id: 0,
    title: (
      <>
        Here you
        <span>
          get
          <HighlightedWord> rewards</HighlightedWord>
        </span>
        for your
        <br /> posts and
        <br /> likes
      </>
    ),
  },
  {
    id: 1,
    title: (
      <>
        Choose
        <br /> your
        <HighlightedWord>thematic</HighlightedWord>
        community
      </>
    ),
  },
  {
    id: 2,
    title: (
      <>
        <HighlightedWord>Blockchain-</HighlightedWord>
        based
        <br /> social
        <br /> network
      </>
    ),
  },
];

export const sections = [
  {
    id: 0,
    title: (
      <>
        Here you get rewards
        <br /> for your posts and likes
      </>
    ),
    desc: (
      <>
        Create posts, vote for them, comment and discuss
        <br /> and receive rewards in Community Points
      </>
    ),
    progressBarText: (
      <>
        People receive rewards <br />
        for their posts and likes
      </>
    ),
  },
  {
    id: 1,
    title: 'Thematic communities',
    desc: (
      <>
        Choose your community, and it will reward your actions.
        <br /> Easy as is!
      </>
    ),
    progressBarText: (
      <>
        Thematic
        <br />
        communities
      </>
    ),
  },
  {
    id: 2,
    title: (
      <>
        The blockchain-based
        <br /> social network
      </>
    ),
    desc:
      'Thanks to the blockchain, It’s now possible for social networks to reward their users and provide autonomy to communities',
    progressBarText: (
      <>
        The blockchain-based <br />
        social network
      </>
    ),
  },
];
