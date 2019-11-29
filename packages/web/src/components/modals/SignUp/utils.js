import {
  PHONE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
} from './constants';

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
    y: 282,
    w: 253,
    h: 55,
  },
  {
    id: 'userId',
    label: 'User id',
    x: 303,
    y: 282,
    w: 253,
    h: 55,
  },
  {
    id: 'username',
    label: 'Username',
    x: 40,
    y: 347,
    w: 515,
    h: 55,
  },
  {
    id: 'password',
    label: 'Password',
    x: 40,
    y: 412,
    w: 515,
    h: 55,
  },
  {
    id: 'active',
    label: 'Active',
    x: 40,
    y: 528,
    w: 515,
    h: 55,
  },
  {
    id: 'owner',
    label: 'Owner',
    x: 40,
    y: 598,
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
  doc.roundedRect(20, 227, 555, 441, 15, 15, 'F');

  doc.setDrawColor('#E2E6E8');
  doc.setFillColor('#FFF');

  for (const { x, y, w, h } of inputs) {
    doc.roundedRect(x, y, w, h, 10, 10, 'DF');
  }
}

function renderFormText(doc, values) {
  for (const { x, y, w, id, label } of inputs) {
    doc.setFontStyle('bold');

    doc.setTextColor('#A5A7BD');
    doc.setFontSize(12);
    doc.text(label, x + 15, y + 10, {
      baseline: 'top',
      maxWidth: w - 30,
    });

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(values[id] || 'empty', x + 15, y + 30, {
      baseline: 'top',
      maxWidth: w - 30,
    });

    doc.setFontStyle('normal');

    if (id === 'password') {
      doc.setFontSize(12);
      doc.setTextColor('#838598');
      doc.text(
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet animi commodi error facilis iste iure nobis quisquam tempore.',
        55,
        482,
        {
          baseline: 'top',
          lineHeightFactor: 1.5,
          maxWidth: 476,
        }
      );
    }
  }
}

function renderFooter(doc, qrData) {
  if (qrData) {
    doc.addImage(qrData, 22, 672, 166, 166);

    doc.setFontSize(18);
    doc.setFontStyle('bold');
    doc.text('Setup code', 200, 689, {
      baseline: 'top',
    });

    doc.setFontSize(12);
    doc.setFontStyle('normal');
    doc.text(
      'Scan this code in the Commun\napps to set up your account quickly\nand easily',
      200,
      716,
      {
        baseline: 'top',
        lineHeightFactor: 1.33,
      }
    );
  }

  doc.setFontSize(18);
  doc.setFontStyle('bold');
  doc.text('Need help?', 200, 779, {
    baseline: 'top',
  });

  doc.setTextColor('#6A80F5');
  doc.setFontSize(12);
  doc.setFontStyle('normal');
  doc.text('Contact commun@commun.com', 200, 809, {
    baseline: 'top',
  });

  doc.setFontStyle('normal');
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

  doc.addImage(logoPic, 'PNG', 30, 20, 106, 24);

  renderFormLayout(doc);

  doc.setFontSize(18);
  doc.setFontSize('bold');

  doc.setFontSize(33);
  doc.setFontStyle('bold');
  doc.text('Created for', 30, 64, {
    baseline: 'top',
  });

  doc.setFontSize(14);
  doc.setFontStyle('bold');
  doc.text(`@${username}`, 30, 109, { baseline: 'top' });

  doc.setTextColor('#A5A7BD');
  doc.text(`on ${formatCurrentDate()}`, 565, 109, {
    align: 'right',
    baseline: 'top',
  });
  doc.setFontStyle('normal');

  doc.setTextColor(0);
  doc.text(
    '1. Print out this document (and/or put it on a USB key or external drive).\n' +
      '2. Fill in your Master Password below.\n' +
      '3. Store your kit in a secure place where you can find it, e.g. a safe deposit box.',
    30,
    141,
    {
      baseline: 'top',
      lineHeightFactor: 1.5,
    }
  );

  doc.setTextColor('#6A80F5');
  doc.setFontSize(18);
  doc.setFontStyle('bold');
  doc.text('Commun Account', 40, 247, {
    baseline: 'top',
  });
  doc.setFontStyle('normal');

  const { master, owner, active } = keys;

  renderFormText(doc, {
    phone,
    userId,
    username,
    password: master,
    active,
    owner,
  });

  renderFooter(doc, qrData);

  doc.save(`Commun-private-keys(${username}).pdf`);
}

export function createPdf({ keys, userId, username, phone }) {
  let QRCode = null;

  if (process.browser) {
    // eslint-disable-next-line global-require
    QRCode = require('qrcode');
  }

  QRCode.toDataURL(
    window.btoa(
      JSON.stringify({
        userId,
        username,
        password: keys.master,
      })
    ),
    (err, url) => {
      let qrData = null;

      if (err) {
        // eslint-disable-next-line no-console
        console.error('QR generation failed:', err);
      } else {
        qrData = url;
      }

      createPdfInner({ keys, userId, username, phone, qrData });
    }
  );
}

// eslint-disable-next-line consistent-return
export function stepToScreenId(step) {
  switch (step) {
    case 'firstStep':
      return PHONE_SCREEN_ID;
    case 'verify':
      return CONFIRM_CODE_SCREEN_ID;
    case 'setUsername':
      return CREATE_USERNAME_SCREEN_ID;
    case 'toBlockChain':
      return MASTER_KEY_SCREEN_ID;
    default:
  }
}
