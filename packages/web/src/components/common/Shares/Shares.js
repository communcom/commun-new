import React, { useEffect, useState } from 'react';
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Icon } from '@commun/icons';
import { up } from '@commun/ui';

const Wrapper = styled.div`
  display: flex;
  margin-top: 15px;

  & > :not(:last-child) {
    margin-right: 5px;
  }

  @media (min-width: 360px) {
    & > :not(:last-child) {
      margin-right: 8px;
    }
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

  ${is('share')`
    background: ${({ theme }) => theme.colors.blue};

    ${up.tablet} {
      svg {
        width: 24px;
        height: 24px;
      }
    }
  `};

  ${up.tablet} {
    width: 60px;
    height: 40px;
  }
`;

export default function Shares({ url, title }) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (process.browser && typeof navigator !== 'undefined' && navigator.share) {
      setCanShare(true);
    }
  }, []);

  function onShareClick() {
    navigator.share({ title, url });
  }

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
      {!canShare ? (
        <WhatsappShareButton url={url} title={title}>
          <Share whatsapp>
            <Icon name="whatsapp" width="16" height="16" />
          </Share>
        </WhatsappShareButton>
      ) : null}
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
      {canShare ? (
        <Share share onClick={onShareClick}>
          <Icon name="share-filled" width="24" height="24" />
        </Share>
      ) : null}
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
