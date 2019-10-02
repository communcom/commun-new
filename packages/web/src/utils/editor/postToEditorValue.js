/* eslint-disable import/prefer-default-export */

import { map } from './utils';

function processNode(node) {
  switch (node.type) {
    case 'text':
      return {
        object: 'text',
        text: node.content,
      };
    case 'mention':
      return {
        object: 'inline',
        type: 'link',
        data: {
          href: `${document.location.origin}/@${node.content}`,
        },
        nodes: [
          {
            object: 'text',
            text: `@${node.content}`,
          },
        ],
      };
    case 'tag':
      return {
        object: 'inline',
        type: 'link',
        data: {
          href: `${document.location.origin}/?tags=${node.content}`,
        },
        nodes: [
          {
            object: 'text',
            text: `#${node.content}`,
          },
        ],
      };
    case 'link':
      return {
        object: 'inline',
        type: 'link',
        data: {
          href: node.attributes.url,
        },
        nodes: [
          {
            object: 'text',
            text: node.content,
          },
        ],
      };
    default:
      return null;
  }
}

export function convertPostToEditorValue(post) {
  const { title } = post.attributes;

  const nodes = [];
  let attachments = [];

  if (title) {
    nodes.push({
      object: 'block',
      type: 'heading1',
      nodes: [
        {
          object: 'text',
          text: title,
        },
      ],
    });
  }

  for (const node of post.content) {
    switch (node.type) {
      case 'paragraph':
        nodes.push({
          object: 'block',
          type: 'paragraph',
          nodes: map(node.content, processNode),
        });
        break;
      case 'image':
        nodes.push({
          object: 'block',
          type: 'image',
          data: {
            src: node.content,
            alt: node.attributes.description || '',
            loading: false,
          },
          nodes: [],
        });
        break;
      case 'attachments':
        attachments = node.content;
        break;
      default:
    }
  }

  return {
    body: {
      document: {
        nodes,
      },
    },
    attachments,
  };
}
