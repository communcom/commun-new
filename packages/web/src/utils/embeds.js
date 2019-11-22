/* eslint-disable import/prefer-default-export */

export function embedRecheck(provider) {
  // recheck on mount component
  if (provider === 'twitter' && window.twttr) {
    window.twttr.widgets.load();
  } else if (provider === 'instagram' && window.instgrm) {
    window.instgrm.Embeds.process();
  }
}
