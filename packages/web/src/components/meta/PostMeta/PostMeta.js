import React from 'react';
import Head from 'next/head';

import { extendedPostType } from 'types';
import { proxifyImageUrl } from 'utils/images/proxy';
import { smartTrim } from 'utils/text';

const PREFIXES = {
  tag: '#',
  mention: '@',
};

export default function PostMeta({ post }) {
  const document = post?.document;

  if (!document) {
    return null;
  }

  const title = document.attributes.title || 'Commun';

  if (process.browser) {
    return (
      <Head>
        <title key="title">{title}</title>
      </Head>
    );
  }

  const { username } = post.author;
  const descriptionBeginning = `@${username} in /${post.community.name}`;
  let text = null;
  let imageUrl = null;
  let attach = null;
  let attachDescription = null;
  const textParts = [];

  for (const node of document.content) {
    switch (node.type) {
      case 'paragraph':
        for (const { type, content } of node.content) {
          textParts.push(`${PREFIXES[type] || ''}${content}`);
        }
        break;
      case 'attachments':
        // eslint-disable-next-line prefer-destructuring
        attach = node.content[0];
        break;
      default:
      // Do nothing
    }
  }

  text = textParts
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  if (text) {
    text = smartTrim(text, 100, true);
  }

  if (attach) {
    switch (attach.type) {
      case 'image':
        imageUrl = attach.content;
        break;

      case 'video':
      case 'embed':
      case 'website':
        if (attach.attributes) {
          imageUrl = attach.attributes.thumbnailUrl;
          attachDescription = attach.attributes.title;
        } else {
          attachDescription = attach.content.trim();
        }
        break;

      default:
      // Do nothing;
    }
  }

  if (imageUrl) {
    imageUrl = proxifyImageUrl(imageUrl);
  }

  let description = descriptionBeginning;

  if (text) {
    description += `\n${text}`;
  } else if (attachDescription) {
    description += `\n${attachDescription}`;
  }

  return (
    <Head>
      <title key="title">{title}</title>
      {imageUrl ? <meta property="og:image" key="og:image" content={imageUrl} /> : null}
      {description ? <meta name="description" content={description} /> : null}
      <meta name="author" key="author" content={username} />
      <meta property="og:title" key="og:title" content={title} />
      {description ? (
        <meta property="og:description" key="og:description" content={description} />
      ) : null}
      {imageUrl ? <meta property="og:image" key="og:image" content={imageUrl} /> : null}
    </Head>
  );
}

PostMeta.propTypes = {
  post: extendedPostType.isRequired,
};
