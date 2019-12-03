import React, { Component } from 'react';
import styled from 'styled-components';

import {
  DOC_BLOCKCHAIN_DISCLAIMER_LINK,
  DOC_COOKIES_POLICY_LINK,
  DOC_PRIVACY_POLICY_LINK,
  DOC_USER_AGREEMENT_LINK,
  DOC_WHITEPAPER_LINK,
  RIGHT_SIDE_BAR_WIDTH,
} from 'shared/constants';
import { styles, up } from '@commun/ui';

export const FOOTER_LINKS = [
  {
    href: DOC_USER_AGREEMENT_LINK,
    desc: 'User Agreement',
  },
  {
    href: DOC_PRIVACY_POLICY_LINK,
    desc: 'Privacy Policy',
  },
  {
    href: DOC_COOKIES_POLICY_LINK,
    desc: 'Cookies Policy',
  },
  {
    href: DOC_BLOCKCHAIN_DISCLAIMER_LINK,
    desc: 'Blockchain Disclaimer',
  },
  {
    href: DOC_WHITEPAPER_LINK,
    desc: 'Whitepaper',
  },
];

// export const APPS_LINKS = [
//   {
//     href: '#',
//     desc: 'iOS application',
//   },
//   {
//     href: '#',
//     desc: 'Android application',
//   },
// ];

const Title = styled.h2`
  display: flex;
  align-items: center;
  min-height: 40px;
  margin: 0;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};

  ${up.tablet} {
    min-height: 0;
    font-size: 0;
    ${styles.visuallyHidden};
  }
`;

const LinksList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0 0 24px;
  color: ${({ theme }) => theme.colors.gray};
  list-style: none;

  ${up.tablet} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0;
    margin-left: -20px;
  }
`;

const ListItem = styled.li`
  position: relative;

  ${up.tablet} {
    margin-left: 20px;

    &::before {
      content: '\u2022';
      position: absolute;
      top: 50%;
      left: -10px;
      transform: translate(-50%, -50%);
    }
  }
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  min-height: 48px;
  text-decoration: none;
  font-size: 15px;
  color: #000;
  transition: color 0.15s;

  &:hover,
  &:focus,
  &:hover > *,
  &:focus > * {
    color: ${({ theme }) => theme.colors.blue};
  }

  ${up.tablet} {
    display: inline-block;
    min-height: auto;
    color: ${({ theme }) => theme.colors.gray};
    font-size: 12px;
    line-height: 18px;
  }
`;

const Wrapper = styled.footer`
  display: none;

  ${up.tablet} {
    display: block;
    width: ${RIGHT_SIDE_BAR_WIDTH}px;
    overflow: hidden;

    &:not(:first-child) {
      padding-top: 5px;
    }
  }
`;

export default class Footer extends Component {
  state = {};

  renderInnerLinks = () =>
    FOOTER_LINKS.map(link => (
      <ListItem key={link.desc}>
        <FooterLink href={link.href} target="_blank" rel="noopener noreferrer">
          {link.desc}
        </FooterLink>
      </ListItem>
    ));

  // renderAppLinks = () =>
  //   APPS_LINKS.map(link => (
  //     <ListItem key={link.desc}>
  //       <FooterLink href={link.href} target="_blank" rel="noopener noreferrer">
  //         {link.desc}
  //       </FooterLink>
  //     </ListItem>
  //   ));

  render() {
    const { className } = this.props;

    return (
      <Wrapper className={className}>
        <Title>Info</Title>
        <LinksList>
          {this.renderInnerLinks()}
          {/* {this.renderAppLinks()} */}
        </LinksList>
      </Wrapper>
    );
  }
}
