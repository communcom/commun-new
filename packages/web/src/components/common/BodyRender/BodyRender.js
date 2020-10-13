/* eslint-disable no-shadow,no-param-reassign */
/* stylelint-disable no-descending-specificity */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles } from '@commun/ui';

import { NodeType } from 'types/editor';
import { COMMUN_HOST } from 'shared/constants';
import { withTranslation } from 'shared/i18n';
import { Link } from 'shared/routes';
import { getWebsiteHostname } from 'utils/format';
import { smartTrim } from 'utils/text';

import Embed from 'components/common/Embed';
import baseStyles from './baseStyles';

const Wrapper = styled.div`
  ${styles.breakWord};
  ${baseStyles};
`;

const EmbedStyled = styled(Embed)`
  margin: 10px 0;
`;

const ReadMoreButton = styled.button.attrs({ type: 'button' })`
  color: ${({ theme }) => theme.colors.blue};
`;

@withTranslation()
export default class BodyRender extends Component {
  static propTypes = {
    content: NodeType.isRequired,
    cutLimits: PropTypes.shape({
      cutOn: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
    }),
    textLength: PropTypes.number,
  };

  static defaultProps = {
    textLength: undefined,
    cutLimits: undefined,
  };

  state = {
    showAll: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { content, textLength, cutLimits } = this.props;
    const { showAll } = this.state;

    return (
      content !== nextProps.content ||
      textLength !== nextProps.textLength ||
      (cutLimits && cutLimits.limit !== nextProps.cutLimits.limit) ||
      (cutLimits && cutLimits.cutOn !== nextProps.cutLimits.cutOn) ||
      showAll !== nextState.showAll
    );
  }

  onLinkClick = e => {
    e.stopPropagation();
  };

  onSeeMoreClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showAll: true,
    });
  };

  onShowLessClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showAll: false,
    });
  };

  renderNode = (node, counters) => {
    if (counters.stop) {
      return null;
    }

    const { textLength, cutLimits, t } = this.props;
    const { showAll } = this.state;

    const previewMode = Boolean(
      !showAll && textLength && cutLimits && textLength > cutLimits.limit
    );

    const softLimit = previewMode ? cutLimits.cutOn : undefined;

    switch (node.type) {
      // TODO: 'post' is a legacy format, remove in future
      case 'post':
      case 'comment':
      case 'document': {
        const items = [];

        for (const childNode of node.content) {
          items.push(this.renderNode(childNode, counters));

          if (previewMode && (counters.symbolsCount >= softLimit || counters.stop)) {
            break;
          }
        }

        if (
          previewMode &&
          (counters.stop || counters.symbolsCount >= softLimit) &&
          !counters.isShowAllAdded
        ) {
          items.push(
            <div>
              <ReadMoreButton onClick={this.onSeeMoreClick}>{t('common.see_more')}</ReadMoreButton>
            </div>
          );
        }

        return items;
      }

      case 'paragraph': {
        const list = Array.isArray(node.content) ? node.content : [node.content];

        const items = [];

        for (const node of list) {
          const item = this.renderNode(node, counters);

          if (!item) {
            // eslint-disable-next-line no-continue
            continue;
          }

          items.push(item);

          if (previewMode && (counters.symbolsCount >= softLimit || counters.stop)) {
            counters.stop = true;
            break;
          }
        }

        if (counters.stop && !counters.isShowAllAdded) {
          counters.isShowAllAdded = true;

          items.push(
            <Fragment key="readmore">
              {' '}
              <ReadMoreButton onClick={this.onSeeMoreClick}>{t('common.see_more')}</ReadMoreButton>
            </Fragment>
          );
        }

        if (!items.length) {
          return null;
        }

        return <p key={node.id}>{items}</p>;
      }

      case 'text': {
        if (!node.content) {
          return null;
        }

        // https://github.com/communcom/commun/issues/2465
        let text = node.content.replace(/\n/g, '').replace(/\r/g, '');

        if (!text) {
          return null;
        }

        const style = node.attributes?.style;
        let className;

        if (style) {
          className = style.join(' ');
        }

        if (previewMode && counters.symbolsCount + text.length >= softLimit) {
          text = smartTrim(text, softLimit - counters.symbolsCount);
          counters.stop = true;
        }

        counters.symbolsCount += text.length;

        return (
          <span key={node.id} className={className}>
            {text}
          </span>
        );
      }

      case 'mention':
        if (!node.content) {
          return null;
        }

        counters.symbolsCount += node.content.length + 1;

        return (
          <Link key={node.id} route="profile" params={{ username: node.content }}>
            {/* eslint-disable-next-line */}
            <a onClick={this.onLinkClick}>@{node.content}</a>
          </Link>
        );

      case 'tag':
        counters.symbolsCount += node.content.length + 1;
        return (
          <Link key={node.id} route="search" params={{ q: `${encodeURI('#')}${node.content}` }}>
            {/* eslint-disable-next-line */}
            <a onClick={this.onLinkClick}>#{node.content}</a>
          </Link>
        );

      case 'link': {
        counters.symbolsCount += node.content.length;
        const url = node.attributes?.url || node.content;

        let target = '_blank';
        try {
          if (getWebsiteHostname(url) === COMMUN_HOST) {
            target = '_self';
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Invalid url:', url);
        }

        return (
          // <Link /> was replaced with just <a /> because https://github.com/zeit/next.js/blob/master/errors/invalid-href-passed.md
          <a
            key={node.id}
            href={url}
            target={target}
            rel="noopener noreferrer"
            onClick={this.onLinkClick}
          >
            {node.content}
          </a>
        );
      }

      case 'image':
      case 'website':
      case 'video':
      case 'embed':
        return <EmbedStyled key={node.id} data={node} />;

      case 'attachments':
        // Do nothing
        return null;

      default:
        // Всё остальное просто игнорируем
        // eslint-disable-next-line no-console
        console.error('Unknown node type:', node);
        return null;
    }
  };

  render() {
    const { content, className, t } = this.props;
    const { showAll } = this.state;

    const counters = {
      symbolsCount: 0,
      isShowAllAdded: false,
      stop: false,
    };

    if (!content) {
      return null;
    }

    return (
      <Wrapper className={className}>
        {this.renderNode(content, counters)}
        {showAll ? (
          <ReadMoreButton onClick={this.onShowLessClick}>{t('common.show_less')}</ReadMoreButton>
        ) : null}
      </Wrapper>
    );
  }
}
