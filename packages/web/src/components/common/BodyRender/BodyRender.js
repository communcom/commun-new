/* eslint-disable no-shadow,no-param-reassign */
/* stylelint-disable no-descending-specificity */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { styles } from '@commun/ui';
import { NodeType } from 'types/editor';
import { Link } from 'shared/routes';
import { smartTrim } from 'utils/text';
import Embed from 'components/common/Embed';

const Wrapper = styled.div`
  ${styles.breakWord};
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;

  p {
    margin: 10px 0;
    line-height: 1.5;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  li p {
    display: inline;
    margin: 0;
  }

  span {
    line-height: 1.5;
  }

  b,
  strong,
  .bold {
    font-weight: 600;
  }

  i,
  .italic {
    font-style: italic;
  }

  ol {
    list-style: decimal;
  }

  ul {
    list-style: disc;
  }

  ol,
  ul {
    margin: 0 0.1em;
    padding-left: 1em;

    ol,
    ul {
      margin: 0.1em;
    }
  }

  pre {
    overflow: hidden;
    white-space: pre-wrap;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};

    &:visited {
      color: #a0adf5;
    }
  }
`;

const EmbedStyled = styled(Embed)`
  margin: 10px 0;
`;

const ReadMoreButton = styled.button.attrs({ type: 'button' })`
  color: ${({ theme }) => theme.colors.blue};
`;

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
      cutLimits.limit !== nextProps.cutLimits.limit ||
      cutLimits.cutOn !== nextProps.cutLimits.cutOn ||
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

    const { textLength, cutLimits } = this.props;
    const { showAll } = this.state;

    const previewMode = Boolean(
      !showAll && textLength && cutLimits && textLength > cutLimits.limit
    );

    const softLimit = previewMode ? cutLimits.cutOn : undefined;

    switch (node.type) {
      case 'post': {
        const items = [];

        for (const childNode of node.content) {
          items.push(this.renderNode(childNode, counters));

          if (previewMode && (counters.symbolsCount >= softLimit || counters.stop)) {
            break;
          }
        }

        if (
          previewMode &&
          ((counters.stop || counters.symbolsCount >= softLimit) && !counters.isShowAllAdded)
        ) {
          items.push(
            <div>
              <ReadMoreButton onClick={this.onSeeMoreClick}>See more</ReadMoreButton>
            </div>
          );
        }

        return items;
      }

      case 'paragraph': {
        const list = Array.isArray(node.content) ? node.content : [node.content];

        const items = [];

        for (const node of list) {
          items.push(this.renderNode(node, counters));

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
              <ReadMoreButton onClick={this.onSeeMoreClick}>see more</ReadMoreButton>
            </Fragment>
          );
        }

        return <p key={node.id}>{items}</p>;
      }

      case 'text': {
        const style = node.attributes?.style;
        let className;

        if (style) {
          className = style.join(' ');
        }

        let text = node.content;

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
        counters.symbolsCount += node.content.length + 1;

        return (
          <Link key={node.id} route="profile" params={{ username: node.content }}>
            <a>@{node.content}</a>
          </Link>
        );

      case 'tag':
        counters.symbolsCount += node.content.length + 1;
        return <a key={node.id}>#{node.content}</a>;

      case 'link': {
        counters.symbolsCount += node.content.length;
        const url = node.attributes?.url || node.content;

        return (
          // <Link /> was replaced with just <a /> because https://github.com/zeit/next.js/blob/master/errors/invalid-href-passed.md
          <a
            key={node.id}
            href={url}
            target="_blank"
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
        return <EmbedStyled key={node.id} data={node} />;

      case 'attachments':
        // Do nothing
        return null;

      default:
        // Всё остальное просто игнорируем
        // eslint-disable-next-line no-console
        console.log('Unknown node type:', node);
        return null;
    }
  };

  render() {
    const { content, className } = this.props;
    const { showAll } = this.state;

    const counters = {
      symbolsCount: 0,
      isShowAllAdded: false,
      stop: false,
    };

    return (
      <Wrapper className={className}>
        {this.renderNode(content, counters)}
        {showAll ? <ReadMoreButton onClick={this.onShowLessClick}>Show less</ReadMoreButton> : null}
      </Wrapper>
    );
  }
}
