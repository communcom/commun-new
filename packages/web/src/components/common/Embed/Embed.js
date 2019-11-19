import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

import Frame from './components/Frame';
import Link from './components/Link';
import Photo from './components/Photo';

export default class Embed extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      type: PropTypes.oneOf(['website', 'image', 'video']).isRequired,
      content: PropTypes.string.isRequired,
      attributes: PropTypes.shape({}),
    }).isRequired,
    isCompact: PropTypes.bool,
    isInForm: PropTypes.bool,
    onRemove: PropTypes.func,
  };

  static defaultProps = {
    isCompact: false,
    isInForm: false,
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
      case 'embed':
        embed = <Frame {...this.props} />;
        break;
      case 'image':
        embed = <Photo {...this.props} />;
        break;
      default:
    }

    if (!embed) {
      return null;
    }

    return (
      <LazyLoad resize once height={320} offset={300}>
        {embed}
      </LazyLoad>
    );
  }
}
