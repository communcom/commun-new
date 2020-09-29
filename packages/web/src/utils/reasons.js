import { i18n } from 'shared/i18n';

export function formatReasonDescription(desc) {
  try {
    const reason = JSON.parse(desc);
    if (Array.isArray(reason)) {
      return reason
        .map(item => {
          if (item.includes('other-')) {
            const report = item.split('-')[1];
            return report.replace(/,+/g, ' ');
          }

          return i18n.t(`reports.${item}`);
        })
        .join(', ');
    }
  } catch (err) {
    // do nothing
  }

  return desc;
}
