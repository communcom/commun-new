import React from 'react';
import Head from 'next/head';

import { profileType } from 'types';
import { useTranslation } from 'shared/i18n';
import { proxifyImageUrl } from 'utils/images/proxy';
import { smartTrim } from 'utils/text';
import { OG_BASE_URL } from 'shared/constants';

export default function ProfileMeta({ profile }) {
  const { t } = useTranslation();
  const title = profile.username || 'Commun';

  if (process.browser) {
    return (
      <Head>
        <title key="title">{title}</title>
      </Head>
    );
  }

  const url = `${OG_BASE_URL}/@${profile.username}`;
  const imageUrl = proxifyImageUrl(profile.avatarUrl);
  let description = '';

  if (profile.personal.biography) {
    description = smartTrim(profile.personal.biography, 100, true);
  }

  const descriptionOG = `${description ? `${description} ` : ''}${
    profile.subscribers.usersCount
  } ${t('common.counters.follower', { count: profile.subscribers.usersCount })} • ${
    profile.stats.postsCount
  } ${t('common.counters.post', { count: profile.stats.postsCount })}`;

  return (
    <Head>
      <title key="title">{title}</title>
      {description ? <meta name="description" key="description" content={description} /> : null}

      {/* Open Graph data */}
      <meta property="og:type" key="og:type" content="profile" />
      <meta property="profile:username" key="profile:username " content={profile.username} />
      <meta property="og:title" key="og:title" content={title} />
      <meta property="og:url" key="og:url" content={url} />
      <meta property="og:description" key="og:description" content={descriptionOG} />
      {imageUrl ? <meta property="og:image" key="og:image" content={imageUrl} /> : null}

      {/* Twitter Card */}
      <meta name="twitter:title" key="twitter:title" content={title} />
      <meta name="twitter:description" key="twitter:description" content={descriptionOG} />
      <meta name="twitter:url" key="twitter:url" content={url} />
      {imageUrl ? <meta name="twitter:image" key="twitter:image" content={imageUrl} /> : null}
    </Head>
  );
}

ProfileMeta.propTypes = {
  profile: profileType.isRequired,
};
