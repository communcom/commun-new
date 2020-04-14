import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LazyLoad from 'components/common/LazyLoad';
import Frame from './components/Frame';
import Link from './components/Link';
import Image from './components/Image';
import InstagramPost from './components/InstagramPost';

export default class Embed extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      type: PropTypes.oneOf(['website', 'instagram', 'image', 'video', 'embed']).isRequired,
      content: PropTypes.string.isRequired,
      attributes: PropTypes.shape({}),
    }).isRequired,
    isCompact: PropTypes.bool,
    isInForm: PropTypes.bool,
    isAttachment: PropTypes.bool,
    onRemove: PropTypes.func,
  };

  static defaultProps = {
    isCompact: false,
    isInForm: false,
    isAttachment: false,
    onRemove: undefined,
  };

  render() {
    const { data } = this.props;
    const { type } = data;

    let embed;
    switch (type) {
      case 'website':
        embed = <Link {...this.props} />;
        break;
      case 'rich':
      case 'video':
      case 'embed': {
        if (type === 'embed' && data?.attributes?.providerName === 'instagram') {
          embed = <InstagramPost {...this.props} />;
        } else {
          embed = <Frame {...this.props} />;
        }
        break;
      }
      case 'image':
        embed = <Image {...this.props} />;
        break;
      default:
    }

    if (!embed) {
      return null;
    }

    return (
      <LazyLoad height={320} offset={300}>
        {embed}
      </LazyLoad>
    );
  }
}
