import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from '@commun/icons';
import { animations, CircleLoader } from '@commun/ui';

import { proxifyImageUrl } from 'utils/images/proxy';
import { humanizeFileSize } from 'utils/format';

import Img from './Img';

const PlayButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
`;

const PlayIcon = styled(Icon).attrs({ name: 'play' })`
  width: 18px;
  height: 18px;
  margin-left: 6px;
  color: #fff;
`;

const GifWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

  &:hover ${PlayButton} {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const GifLayerImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const GifDescription = styled.span`
  position: absolute;
  display: block;
  bottom: 8px;
  right: 8px;
  padding: 7px;
  border-radius: 3px;
  white-space: nowrap;
  font-size: 12.5px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;

const CircleLoaderStyled = styled(CircleLoader)`
  opacity: 0;
  animation: ${animations.fadeIn} 0.25s forwards;
  animation-delay: 0.25s;
`;

export default function Gif({ src, imageWidth, size, ...props }) {
  const [isPlay, setIsPlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    setIsPlay(!isPlay);
  }

  function onImageLoad() {
    setIsLoaded(true);
  }

  let humanSize = null;

  if (size) {
    humanSize = humanizeFileSize(size);
  }

  return (
    <GifWrapper {...props} title={isPlay ? null : 'Play'} onClick={onClick}>
      <Img src={proxifyImageUrl(src, { size: `${imageWidth}x0` })} />
      {isPlay ? (
        <>
          <GifLayerImg src={proxifyImageUrl(src)} onLoad={onImageLoad} />
          {isLoaded ? null : <CircleLoaderStyled noShadow />}
        </>
      ) : (
        <>
          <PlayButton title="Play">
            <PlayIcon />
          </PlayButton>
          <GifDescription>GIF{humanSize ? ` · ${humanSize}` : ''}</GifDescription>
        </>
      )}
    </GifWrapper>
  );
}

Gif.propTypes = {
  src: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired,
  size: PropTypes.number,
};

Gif.defaultProps = {
  size: undefined,
};
