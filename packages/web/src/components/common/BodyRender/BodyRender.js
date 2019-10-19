import React, { Component } from 'react';
import styled from 'styled-components';

import { NodeType } from 'types/editor';
import { Link } from 'shared/routes';
import { styles } from '@commun/ui';

const Wrapper = styled.div`
  ${styles.breakWord};
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.41px;

  .bold {
    font-weight: 600;
  }

  .italic {
    font-style: italic;
  }

  & a {
    color: ${({ theme }) => theme.colors.contextBlue};

    &:visited {
      color: #a0adf5;
    }
  }
`;

export default class BodyRender extends Component {
  static propTypes = {
    content: NodeType.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    const { content } = this.props;

    return content !== nextProps.content;
  }

  renderNode = node => {
    switch (node.type) {
      case 'post':
        return node.content.map(this.renderNode);

      case 'paragraph': {
        const list = Array.isArray(node.content) ? node.content : [node.content];
        return <p key={node.id}>{list.map(this.renderNode)}</p>;
      }

      case 'text': {
        const style = node.attributes?.style;
        let className;

        if (style) {
          className = style.join(' ');
        }

        return (
          <span key={node.id} className={className}>
            {node.content}
          </span>
        );
      }

      case 'mention':
        return (
          <Link key={node.id} route="profile" params={{ username: node.content }}>
            <a>@{node.content}</a>
          </Link>
        );

      case 'tag':
        return <a key={node.id}>#{node.content}</a>;

      case 'link':
        return (
          <Link key={node.id} to={node.attributes.url}>
            <a>{node.content}</a>
          </Link>
        );

      // Всё остальное просто игнорируем
      default:
        return null;
    }
  };

  render() {
    const { content, className } = this.props;

    return <Wrapper className={className}>{this.renderNode(content)}</Wrapper>;
  }
}
