import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { feedImageWidthSelector } from 'store/selectors/ui';
import { proxifyImageUrl } from 'utils/images/proxy';

import Img from './Img';
import Gif from './Gif';

function ImageAttachment({ attach, imageWidth, isComment, autoPlay, ...props }) {
  const attrs = attach.attributes;

  if (attrs && attrs.mimeType === 'image/gif') {
    if (autoPlay) {
      return <Img {...props} src={proxifyImageUrl(attach.content)} isComment={isComment} />;
    }

    return <Gif {...props} src={attach.content} size={attrs.size} imageWidth={imageWidth} />;
  }

  return (
    <Img
      {...props}
      src={proxifyImageUrl(attach.content, { size: `${imageWidth}x0` })}
      isComment={isComment}
    />
  );
}

ImageAttachment.propTypes = {
  attach: PropTypes.shape({
    content: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      mimeType: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      size: PropTypes.number.isRequired,
    }),
  }).isRequired,
  isComment: PropTypes.bool,
  autoPlay: PropTypes.bool,
  imageWidth: PropTypes.number.isRequired,
};

ImageAttachment.defaultProps = {
  isComment: false,
  autoPlay: false,
};

export default connect(state => ({
  imageWidth: feedImageWidthSelector(state),
}))(ImageAttachment);
