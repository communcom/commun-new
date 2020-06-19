import React from 'react';
import Head from 'next/head';

import { communityType } from 'types';
import { OG_BASE_URL } from 'shared/constants';
import { useTranslation } from 'shared/i18n';
import { proxifyImageUrl } from 'utils/images/proxy';
import { smartTrim } from 'utils/text';

export default function CommunityMeta({ community }) {
  const { t } = useTranslation();
  const title = community.name || 'Commun';

  if (process.browser) {
    return (
      <Head>
        <title key="title">{title}</title>
      </Head>
    );
  }

  const url = `${OG_BASE_URL}/${community.alias}`;
  const imageUrl = proxifyImageUrl(community.avatarUrl);
  let description = '';

  if (community.description) {
    description = smartTrim(community.description, 100, true);
  }

  const descriptionOG = `${description ? `${description} ` : ''}${
    community.subscribersCount
  } ${t('common.counters.follower', { count: community.subscribersCount })} • ${
    community.postsCount
  } ${t('common.counters.post', { count: community.postsCount })}`;

  return (
    <Head>
      <title key="title">{title}</title>
      {description ? <meta name="description" key="description" content={description} /> : null}

      {/* Open Graph data */}
      <meta property="og:title" key="og:title" content={title} />
      <meta property="og:url" key="og:url" content={url} />
      <meta property="og:description" key="og:description" content={descriptionOG} />
      {imageUrl ? <meta property="og:image" key="og:image" content={imageUrl} /> : null}

      {/* Twitter Card */}
      <meta name="twitter:title" key="twitter:title" content={title} />
      <meta name="twitter:description" key="twitter:description" content={descriptionOG} />
      <meta name="twitter:url" key="twitter:url" content={url} />
      {imageUrl ? <meta name="twitter:image" key="twitter:image" content={imageUrl} /> : null}

      <link rel="canonical" href={url} />
    </Head>
  );
}

CommunityMeta.propTypes = {
  community: communityType.isRequired,
};
