import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import {
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TumblrShareButton,
} from 'react-share';

import { up } from '@commun/ui';
import { Icon } from '@commun/icons';

const Wrapper = styled.div`
  display: flex;
  margin-top: 16px;

  & > :not(:last-child) {
    margin-right: 10px;
  }
`;

const Share = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 30px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  outline: none;

  ${is('twitter')`
    background: #6aace8;
    
    ${up.tablet} {
      svg {
        width: 20px;
        height: 16px;
      }
    }
  `};

  ${is('facebook')`
    background: #4e92f8;
    
    ${up.tablet} {
      svg {
        width: 11px;
        height: 20px;
      }
    }
  `};

  ${is('whatsapp')`
    background: #55cd6c;
    
    ${up.tablet} {
      svg {
        width: 22px;
        height: 22px;
      }
    }
  `};

  ${is('telegram')`
    background: #59ace3;
    
    ${up.tablet} {
      svg {
        width: 20px;
        height: 16px;
      }
    }
  `};

  ${is('reddit')`
    background: #ff4500;
    
    ${up.tablet} {
      svg {
        width: 25px;
        height: 22px;
      }
    }
  `};

  ${is('tumblr')`
    background: #041933;
    
    ${up.tablet} {
      svg {
        width: 12px;
        height: 20px;
      }
    }
  `};

  ${up.tablet} {
    width: 60px;
    height: 40px;
  }
`;

export default function Shares({ url, title }) {
  return (
    <Wrapper>
      <TwitterShareButton url={url} title={title} hashtags={[]}>
        <Share twitter>
          <Icon name="twitter" width="15" height="12" />
        </Share>
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={title} hashtag="">
        <Share facebook>
          <Icon name="facebook" width="8" height="15" />
        </Share>
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={title}>
        <Share whatsapp>
          <Icon name="whatsapp" width="16" height="16" />
        </Share>
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={title}>
        <Share telegram>
          <Icon name="telegram" width="15" height="12" />
        </Share>
      </TelegramShareButton>
      <RedditShareButton url={url} title={title}>
        <Share reddit>
          <Icon name="reddit" width="19" height="17" />
        </Share>
      </RedditShareButton>
      <TumblrShareButton url={url} title={title} tags={[]}>
        <Share tumblr>
          <Icon name="tumblr" width="9" height="15" />
        </Share>
      </TumblrShareButton>
    </Wrapper>
  );
}

Shares.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
};

Shares.defaultProps = {
  title: '',
};
