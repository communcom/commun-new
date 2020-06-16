import React, { PureComponent } from 'react';

import { Link } from 'shared/routes';

export default class Linkify extends PureComponent {
  render() {
    const { children } = this.props;

    const parts = [];

    let prevPosition = 0;

    children.replace(/https?:\/\/[^\s)]+/g, (url, position) => {
      if (position > prevPosition) {
        const stringWithoutLink = children.substring(prevPosition, position);

        parts.push(stringWithoutLink);
      }

      parts.push(
        <Link key={position} to={url} passHref>
          <a target="_blank" rel="noopener nofollow">
            {url}
          </a>
        </Link>
      );

      prevPosition = position + url.length;
    });

    if (prevPosition < children.length) {
      const tailString = children.substring(prevPosition, children.length);

      parts.push(tailString);
    }

    return parts;
  }
}
