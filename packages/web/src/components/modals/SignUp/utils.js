const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const logoPic =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANUAAAAwCAMAAACxF8+AAAAAZlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrgPZqgPYAAABqgPVpgPRogPNogPRqgPVrgPUAAABpgPJwgO9pgPVqgPRpf/RogPRqgPMAAABqgPU3xJkLAAAAIHRSTlMAQN+An78fYO8QcM+QUDC/37CfYEAg78+PUBCwkHAwgI8ZaJMAAANLSURBVGje7ZrZduMgDIYxO3jJpGu6jvv+LzkZ24r4Y2ewL3zmlNP/qkZI6ANMi1xRkN6+Rj2JkvQ0UR1EQXr4mnQvCtI7UT2KgvQ8Qf0SBemRlupOFKR7onoRBemOqF5FQfpV9Ln+IQrSB1F9ioJ0WDrXQ+eiUq4K0NW2Q6NYVKjOxra79HVKRezKpjRKOAeNrRUbZd3ZLckP9bpwrlfG95OMszS6klOb15a7Dp3+WicX6cYIs66Dt702WT35mQumHp/p0Y32JEjgID3HB73MzvVw6lM1YlDr00YFVH2wEmyKn6RNqaI4ganz4LeOyqVBfLvqXA91DxqzUj1KA5WTqS1CZ5lSGTDVFqaqWkmlIYi3a851ww4cve2vdSKqrBwllJNZRbXshvqkpfqNQXp/1EZOOXG0Wh8lzyxQGX30yQxqXZPhKiGp9fAz+/G2yFNx/Mv0h9vn+oMAv2bo2jXSJpFrm2xGA1RDP367VNLRY0KRTBSS/VyeiuOjG+qA12DKUgtQDS9+Q4uVUFn2ZneTzqUEk+fJ4A2uslQYpGI3FC3Vm4CM8Q206B3ocOTAx8nkwT2mTxJMDaQXNlJZGE5nrsE0vbUAtbQ40MkkVBEXlfyACiI7DCk3URncQzp7DZY89SzFgZNxZUJVzXnZaCEy5NptpUIMA4+za/AzNcBeQyo/o+TEOxzmNlUzz3U7lbpJhdfg92UqXJt/UNm1VGpfKrwGP6xZq/9DpfJU2fKm533CipiCaJhyf6pmM9UTnOvsZhbPwA6D1btSSR4sS5Utbx7HZQjQL9Dxjb8mdqJqcL/7PFW2vBmvX6yKvSVm1O5BxS9SRR3zVNnypu1hXSrdT6zsXnli3IGKTXWgwbJU+fKmoT87T0ppOYULcmyUp6iog9qBCiZWKhdpsA1UWN7kTFDcCpJiByoKgspT5cubcTGcuoay+1HhFBqTpcqWN+cABOthKCt2o8IMahs3UX3eKm9anaRfLbTWTog9qYS7lLNUEDZLtbK8aVulz2oc3LPC0NrEDqqAg+ixG57skrECk2UTGqlBDeMHMmKQ2XCsQ4mfrV6L/Gz18vPZ6tuoyM9WSXmzICXX4IJ0KPK/fLi8WZB+/svn+4jLm6A/xhcyzsdCeXAAAAAASUVORK5CYII=';

const inputs = [
  {
    id: 'phone',
    label: 'Phone number',
    x: 40,
    y: 262,
    w: 253,
    h: 55,
  },
  {
    id: 'userId',
    label: 'User id',
    x: 303,
    y: 262,
    w: 253,
    h: 55,
  },
  {
    id: 'username',
    label: 'Username',
    x: 40,
    y: 327,
    w: 515,
    h: 55,
  },
  {
    id: 'password',
    label: 'Password',
    x: 40,
    y: 392,
    w: 515,
    h: 55,
  },
  {
    id: 'active',
    label: 'Active',
    x: 40,
    y: 508,
    w: 515,
    h: 55,
  },
  {
    id: 'owner',
    label: 'Owner',
    x: 40,
    y: 573,
    w: 515,
    h: 55,
  },
];

function formatCurrentDate() {
  const now = new Date();

  const date = now.getDate();

  let suffix = '';

  if (date === 1 || date === 21 || date === 31) {
    suffix = 'st';
  } else if (date === 2 || date === 22) {
    suffix = 'nd';
  } else if (date === 3 || date === 23) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }

  return `${MONTHS[now.getMonth()]} ${date}${suffix}, ${now.getFullYear()}`;
}

function renderFormLayout(doc) {
  doc.setDrawColor(0);
  doc.setFillColor('#F0F2FE');
  doc.roundedRect(25, 247, 545, 395, 15, 15, 'F');

  doc.setDrawColor('#E2E6E8');
  doc.setFillColor('#FFF');

  for (const { x, y, w, h } of inputs) {
    doc.roundedRect(x, y, w, h, 10, 10, 'DF');
  }
}

function renderFormText(doc, values) {
  for (const { x, y, w, id, label } of inputs) {
    doc.setTextColor('#A5A7BD');
    doc.setFontSize(12);
    doc.setFontStyle('normal');
    doc.text(label, x + 15, y + 10, {
      baseline: 'top',
      maxWidth: w - 30,
    });

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFontStyle('bold');
    doc.text(values[id] || 'empty', x + 15, y + 30, {
      baseline: 'top',
      maxWidth: w - 30,
    });

    doc.setFontStyle('normal');

    if (id === 'password') {
      doc.setFontSize(12);
      doc.setTextColor('#838598');
      doc.text(
        'Important to note that we don’t keep and can’t restore your password. Please make sure you keep your password in a safe place, and nobody else would have access to it.',
        298,
        462,
        {
          baseline: 'top',
          align: 'center',
          lineHeightFactor: 1.5,
          maxWidth: 505,
        }
      );
    }
  }
}

function renderFooter(doc, qrData) {
  if (qrData) {
    doc.addImage(qrData, 25, 660, 160, 160);

    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Setup code', 200, 677, {
      baseline: 'top',
    });

    doc.setFontSize(12);
    doc.setFontStyle('normal');
    doc.text('Scan the code of Commun apps to\nset up your account quickly', 200, 705, {
      baseline: 'top',
      lineHeightFactor: 1.33,
    });
  }

  doc.setFontSize(18);
  doc.setFontStyle('bold');
  doc.text('Need help?', 200, 759, {
    baseline: 'top',
  });

  doc.setTextColor('#6A80F5');
  doc.setFontSize(12);
  doc.setFontStyle('normal');
  doc.text('support@commun.com', 200, 787, {
    baseline: 'top',
  });

  doc.setFontStyle('normal');
}

function openDoc(doc, fileName) {
  const ua = window.navigator.userAgent.toLowerCase();

  if (/iphone|ipod|ipad|ios/.test(ua)) {
    const res = doc.output('bloburi', {
      filename: fileName,
    });
    window.open(res);
  } else {
    doc.save(fileName);
  }
}

function createPdfInner({ keys, userId, username, phone, qrData }) {
  let JsPdf = null;
  if (process.browser) {
    // eslint-disable-next-line global-require
    JsPdf = require('jspdf');
  }

  const doc = new JsPdf({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  doc.setDrawColor(0);
  doc.setTextColor(0);
  doc.setFontSize(14);

  doc.addImage(logoPic, 'PNG', 30, 30, 106, 24);

  renderFormLayout(doc);

  doc.setFontSize(18);
  doc.setFontSize('bold');

  doc.setFontSize(33);
  doc.setFontStyle('bold');
  doc.text('Created for', 30, 74, {
    baseline: 'top',
  });

  doc.setFontSize(14);
  doc.setFontStyle('bold');
  doc.text(`@${username}`, 30, 119, { baseline: 'top' });

  doc.setTextColor('#A5A7BD');
  doc.setFontStyle('normal');
  doc.text(`on ${formatCurrentDate()}`, 565, 119, {
    align: 'right',
    baseline: 'top',
  });

  const blockY = 152;

  doc.setTextColor(0);
  doc.text(
    '1. Print out this document (and/or put it on a USB stick or external drive).',
    30,
    blockY,
    {
      baseline: 'top',
      lineHeightFactor: 1.5,
      maxWidth: 545,
    }
  );

  doc.text('2. Fill in your Master Password below.', 30, blockY + 22, {
    baseline: 'top',
    lineHeightFactor: 1.5,
    maxWidth: 545,
  });

  doc.text(
    '3. Store your kit in a secure place that you can quickly access at any time, e.g. a safe deposit box.',
    30,
    blockY + 44,
    {
      baseline: 'top',
      lineHeightFactor: 1.5,
      maxWidth: 545,
    }
  );

  const { master, owner, active } = keys;

  renderFormText(doc, {
    phone,
    userId,
    username,
    password: master,
    active: active.privateKey,
    owner: owner.privateKey,
  });

  renderFooter(doc, qrData);

  return () => {
    openDoc(doc, `Commun-private-keys(${username}).pdf`);
  };
}

function generateQr(str) {
  return new Promise((resolve, reject) => {
    let QRCode = null;

    if (process.browser) {
      // eslint-disable-next-line global-require
      QRCode = require('qrcode');
    }

    QRCode.toDataURL(str, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function createPdf({ keys, userId, username, phone }) {
  const encodedQrData = window.btoa(
    JSON.stringify({
      userId,
      username,
      password: keys.master,
    })
  );

  let qrData;

  try {
    qrData = await generateQr(encodedQrData);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('QR generation failed:', err);
  }

  return createPdfInner({ keys, userId, username, phone, qrData });
}
