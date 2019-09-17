import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

import Frame from './components/Frame';
import Link from './components/Link';
import Photo from './components/Photo';

export default class Embed extends PureComponent {
  static propTypes = {
    data: PropTypes.shape().isRequired,
    isCompact: PropTypes.bool,
    isInForm: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    isCompact: false,
    isInForm: false,
    onClose: null,
  };

  render() {
    const {
      data: { type },
    } = this.props;

    let embed;
    switch (type) {
      case 'link':
        embed = <Link {...this.props} />;
        break;
      case 'rich':
      case 'video':
      case 'embed':
        embed = <Frame {...this.props} />;
        break;
      case 'photo':
        embed = <Photo {...this.props} />;
        break;
      default:
    }

    return (
      <LazyLoad resize once height="100%" offset={1000}>
        {embed}
      </LazyLoad>
    );
  }
}
