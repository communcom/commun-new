/* eslint-disable no-console */
import React from 'react';

import { GTAG_KEYS } from 'shared/constants';

function renderDataLayer(tags) {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer && window.dataLayer.push(arguments);}
    gtag('js', new Date());
    ${tags.map(trackingId => `gtag('config', '${trackingId}');`).join(``)}
  `;
}

export default function Gtag() {
  if (!GTAG_KEYS) {
    return null;
  }

  let tags = [];

  try {
    tags = JSON.parse(GTAG_KEYS);

    if (!Array.isArray(tags)) {
      throw Error('must be array of trackingIds');
    }

    if (!tags.length) {
      throw Error('must not be empty array');
    }
  } catch (err) {
    console.warn(`WEB_GTAG_KEYS ${err.message}`);
    return null;
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${tags[0]}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: renderDataLayer(tags),
        }}
      />
    </>
  );
}
