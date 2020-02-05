import React from 'react';
import Head from 'next/head';

import { extendedPostType } from 'types';
import { proxifyImageUrl } from 'utils/images/proxy';
import { smartTrim } from 'utils/text';

const PREFIXES = {
  tag: '#',
  mention: '@',
};

function getDescription(document) {
  const textParts = [];

  for (const node of document.content) {
    if (node.type === 'paragraph') {
      textParts.push(' ');

      for (const { type, content } of node.content) {
        textParts.push(`${PREFIXES[type] || ''}${content}`);
      }
    }
  }

  const text = textParts
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return null;
  }

  return smartTrim(text, 300, true);
}

export default function PostMeta({ post }) {
  const document = post?.document;

  if (!document) {
    return null;
  }

  const text = getDescription(document);
  const title =
    document.attributes.title ||
    smartTrim(text, 70, true) ||
    `Commun - ${post.community.name} - Post from ${post.author.username}`;

  if (process.browser) {
    return (
      <Head>
        <title key="title">{title}</title>
      </Head>
    );
  }

  const { username } = post.author;
  const descriptionBeginning = `@${username} posted in /${post.community.name} community`;
  let imageUrl = null;
  let attach = null;
  let attachDescription = null;

  for (const node of document.content) {
    switch (node.type) {
      case 'attachments':
        // eslint-disable-next-line prefer-destructuring
        attach = node.content[0];
        break;
      default:
      // Do nothing
    }
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

  let description = descriptionBeginning;

  if (text) {
    description += `\n${text}`;
  } else if (attachDescription) {
    description += `\n${attachDescription}`;
  }

  if (imageUrl) {
    imageUrl = proxifyImageUrl(imageUrl);
  }

  return (
    <Head>
      <title key="title">{title}</title>

      {/* Open Graph data */}
      <meta name="author" key="author" content={username} />
      <meta property="og:type" key="og:type" content="article" />
      {post.meta.creationTime ? (
        <meta
          property="article:published_time"
          key="article:published_time"
          content={post.meta.creationTime}
        />
      ) : null}
      <meta property="og:title" key="og:title" content={title} />
      <meta property="og:url" key="og:url" content={post.url} />
      {description ? (
        <>
          <meta name="description" key="description" content={description} />
          <meta property="og:description" key="og:description" content={description} />
        </>
      ) : null}
      {imageUrl ? <meta property="og:image" key="og:image" content={imageUrl} /> : null}

      {/* Twitter Card */}
      <meta name="twitter:title" key="twitter:title" content={title} />
      {description ? (
        <meta name="twitter:description" key="twitter:description" content={description} />
      ) : null}
      <meta name="twitter:url" key="twitter:url" content={post.url} />

      {imageUrl ? <meta name="twitter:image" key="twitter:image" content={imageUrl} /> : null}
    </Head>
  );
}

PostMeta.propTypes = {
  post: extendedPostType.isRequired,
};
