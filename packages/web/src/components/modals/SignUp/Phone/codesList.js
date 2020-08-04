import ascend from 'ramda/src/ascend';
import descend from 'ramda/src/descend';
import prop from 'ramda/src/prop';
import sortWith from 'ramda/src/sortWith';

const codes = sortWith([descend(prop('available')), ascend(prop('country'))])([
  {
    code: '93',
    countryCode: 'AF',
    country: 'Afghanistan',
    available: false,
  },
  {
    code: '374',
    countryCode: 'AM',
    country: 'Armenia',
    available: false,
  },
  {
    code: '994',
    countryCode: 'AZ',
    country: 'Azerbaijan',
    available: false,
  },
  {
    code: '358',
    countryCode: 'AX',
    country: 'Aland Islands',
    available: true,
  },
  {
    code: '355',
    countryCode: 'AL',
    country: 'Albania',
    available: false,
  },
  {
    code: '213',
    countryCode: 'DZ',
    country: 'Algeria',
    available: true,
  },
  {
    code: '1684',
    countryCode: 'AS',
    country: 'American Samoa',
    available: true,
  },
  {
    code: '376',
    countryCode: 'AD',
    country: 'Andorra',
    available: false,
  },
  {
    code: '244',
    countryCode: 'AO',
    country: 'Angola',
    available: false,
  },
  {
    code: '1264',
    countryCode: 'AI',
    country: 'Anguilla',
    available: false,
  },
  {
    code: '1268',
    countryCode: 'AG',
    country: 'Antigua and Barbuda',
    available: false,
  },
  {
    code: '54',
    countryCode: 'AR',
    country: 'Argentina',
    available: true,
  },

  {
    code: '297',
    countryCode: 'AW',
    country: 'Aruba',
    available: false,
  },
  {
    code: '61',
    countryCode: 'AU',
    country: 'Australia',
    available: true,
  },
  {
    code: '43',
    countryCode: 'AT',
    country: 'Austria',
    available: true,
  },

  {
    code: '1',
    countryCode: 'BS',
    country: 'Bahamas',
    available: false,
  },
  {
    code: '973',
    countryCode: 'BH',
    country: 'Bahrain',
    available: true,
  },
  {
    code: '880',
    countryCode: 'BD',
    country: 'Bangladesh',
    available: false,
  },
  {
    code: '1246',
    countryCode: 'BB',
    country: 'Barbados',
    available: false,
  },
  {
    code: '375',
    countryCode: 'BY',
    country: 'Belarus',
    available: false,
  },
  {
    code: '32',
    countryCode: 'BE',
    country: 'Belgium',
    available: true,
  },
  {
    code: '501',
    countryCode: 'BZ',
    country: 'Belize',
    available: false,
  },
  {
    code: '229',
    countryCode: 'BJ',
    country: 'Benin',
    available: false,
  },
  {
    code: '1441',
    countryCode: 'BM',
    country: 'Bermuda',
    available: false,
  },
  {
    code: '975',
    countryCode: 'BT',
    country: 'Bhutan',
    available: false,
  },
  {
    code: '591',
    countryCode: 'BO',
    country: 'Bolivia',
    available: true,
  },
  {
    code: '387',
    countryCode: 'BA',
    country: 'Bosnia and Herzegovina',
    available: true,
  },
  {
    code: '267',
    countryCode: 'BW',
    country: 'Botswana',
    available: false,
  },
  {
    code: '55',
    countryCode: 'BR',
    country: 'Brazil',
    available: true,
  },
  {
    code: '246',
    countryCode: 'IO',
    country: 'British Indian Ocean Territory',
    available: true,
  },
  {
    code: '1284',
    countryCode: 'VG',
    country: 'British Virgin Islands',
    available: true,
  },
  {
    code: '673',
    countryCode: 'BN',
    country: 'Brunei',
    available: true,
  },
  {
    code: '359',
    countryCode: 'BG',
    country: 'Bulgaria',
    available: true,
  },
  {
    code: '226',
    countryCode: 'BF',
    country: 'Burkina Faso',
    available: false,
  },
  {
    code: '257',
    countryCode: 'BI',
    country: 'Burundi',
    available: false,
  },
  {
    code: '855',
    countryCode: 'KH',
    country: 'Cambodia',
    available: false,
  },
  {
    code: '237',
    countryCode: 'CM',
    country: 'Cameroon',
    available: false,
  },
  {
    code: '1',
    countryCode: 'CA',
    country: 'Canada',
    available: true,
  },
  {
    code: '238',
    countryCode: 'CV',
    country: 'Cape Verde',
    available: false,
  },
  {
    code: '599',
    countryCode: 'BQ',
    country: 'Caribbean Netherlands',
    available: true,
  },
  {
    code: '1345',
    countryCode: 'KY',
    country: 'Cayman Islands',
    available: true,
  },
  {
    code: '236',
    countryCode: 'CF',
    country: 'Central African Republic',
    available: false,
  },
  {
    code: '235',
    countryCode: 'TD',
    country: 'Chad',
    available: false,
  },
  {
    code: '56',
    countryCode: 'CL',
    country: 'Chile',
    available: true,
  },
  {
    code: '86',
    countryCode: 'CN',
    country: 'China',
    available: false,
  },
  {
    code: '61',
    countryCode: 'CX',
    country: 'Christmas Island',
    available: true,
  },
  {
    code: '61',
    countryCode: 'CC',
    country: 'Cocos (Keeling) Islands',
    available: true,
  },
  {
    code: '57',
    countryCode: 'CO',
    country: 'Colombia',
    available: true,
  },
  {
    code: '269',
    countryCode: 'KM',
    country: 'Comoros',
    available: false,
  },
  {
    code: '243',
    countryCode: 'CD',
    country: 'Democratic Republic Congo',
    available: false,
  },
  {
    code: '242',
    countryCode: 'CG',
    country: 'Republic of Congo',
    available: false,
  },
  {
    code: '682',
    countryCode: 'CK',
    country: 'Cook Islands',
    available: true,
  },
  {
    code: '506',
    countryCode: 'CR',
    country: 'Costa Rica',
    available: true,
  },
  {
    code: '225',
    countryCode: 'CI',
    country: "Côte d'Ivoire",
    available: false,
  },
  {
    code: '385',
    countryCode: 'HR',
    country: 'Croatia',
    available: true,
  },
  {
    code: '53',
    countryCode: 'CU',
    country: 'Cuba',
    available: true,
  },
  {
    code: '599',
    countryCode: 'CW',
    country: 'Curaçao',
    available: true,
  },
  {
    code: '357',
    countryCode: 'CY',
    country: 'Cyprus',
    available: false,
  },
  {
    code: '420',
    countryCode: 'CZ',
    country: 'Czech Republic',
    available: false,
  },
  {
    code: '45',
    countryCode: 'DK',
    country: 'Denmark',
    available: false,
  },
  {
    code: '253',
    countryCode: 'DJ',
    country: 'Djibouti',
    available: false,
  },
  {
    code: '1767',
    countryCode: 'DM',
    country: 'Dominica',
    available: true,
  },
  {
    code: '1809',
    countryCode: 'DO',
    country: 'Dominican Republic',
    available: true,
  },
  {
    code: '670',
    countryCode: 'TL',
    country: 'East Timor',
    available: false,
  },
  {
    code: '593',
    countryCode: 'EC',
    country: 'Ecuador',
    available: true,
  },
  {
    code: '20',
    countryCode: 'EG',
    country: 'Egypt',
    available: true,
  },
  {
    code: '503',
    countryCode: 'SV',
    country: 'El Salvador',
    available: true,
  },
  {
    code: '240',
    countryCode: 'GQ',
    country: 'Equatorial Guinea',
    available: false,
  },
  {
    code: '291',
    countryCode: 'ER',
    country: 'Eritrea',
    available: false,
  },
  {
    code: '372',
    countryCode: 'EE',
    country: 'Estonia',
    available: true,
  },
  {
    code: '251',
    countryCode: 'ET',
    country: 'Ethiopia',
    available: false,
  },
  {
    code: '500',
    countryCode: 'FK',
    country: 'Falkland Islands (Islas Malvinas)',
    available: true,
  },
  {
    code: '298',
    countryCode: 'FO',
    country: 'Faroe Islands',
    available: true,
  },
  {
    code: '679',
    countryCode: 'FJ',
    country: 'Fiji',
    available: true,
  },
  {
    code: '358',
    countryCode: 'FI',
    country: 'Finland',
    available: true,
  },
  {
    code: '33',
    countryCode: 'FR',
    country: 'France',
    available: true,
  },
  {
    code: '594',
    countryCode: 'GF',
    country: 'French Guiana',
    available: true,
  },
  {
    code: '689',
    countryCode: 'PF',
    country: 'French Polynesia',
    available: true,
  },
  {
    code: '241',
    countryCode: 'GA',
    country: 'Gabon',
    available: false,
  },
  {
    code: '220',
    countryCode: 'GM',
    country: 'Gambia',
    available: false,
  },
  {
    code: '995',
    countryCode: 'GE',
    country: 'Georgia',
    available: false,
  },
  {
    code: '49',
    countryCode: 'DE',
    country: 'Germany',
    available: true,
  },
  {
    code: '233',
    countryCode: 'GH',
    country: 'Ghana',
    available: true,
  },
  {
    code: '350',
    countryCode: 'GI',
    country: 'Gibraltar',
    available: false,
  },
  {
    code: '30',
    countryCode: 'GR',
    country: 'Greece',
    available: true,
  },
  {
    code: '299',
    countryCode: 'GL',
    country: 'Greenland',
    available: true,
  },
  {
    code: '1473',
    countryCode: 'GD',
    country: 'Grenada',
    available: true,
  },
  {
    code: '590',
    countryCode: 'GP',
    country: 'Guadeloupe',
    available: true,
  },
  {
    code: '1671',
    countryCode: 'GU',
    country: 'Guam',
    available: true,
  },
  {
    code: '502',
    countryCode: 'GT',
    country: 'Guatemala',
    available: false,
  },
  {
    code: '44',
    countryCode: 'GG',
    country: 'Guernsey',
    available: true,
  },
  {
    code: '224',
    countryCode: 'GN',
    country: 'Guinea Conakry',
    available: false,
  },
  {
    code: '245',
    countryCode: 'GW',
    country: 'Guinea-Bissau',
    available: false,
  },
  {
    code: '592',
    countryCode: 'GY',
    country: 'Guyana',
    available: true,
  },
  {
    code: '509',
    countryCode: 'HT',
    country: 'Haiti',
    available: false,
  },
  {
    code: '672',
    countryCode: 'HM',
    country: 'Heard Island and McDonald Islands',
    available: true,
  },
  {
    code: '504',
    countryCode: 'HN',
    country: 'Honduras',
    available: false,
  },
  {
    code: '852',
    countryCode: 'HK',
    country: 'Hong Kong',
    available: true,
  },
  {
    code: '36',
    countryCode: 'HU',
    country: 'Hungary',
    available: true,
  },
  {
    code: '354',
    countryCode: 'IS',
    country: 'Iceland',
    available: true,
  },
  {
    code: '91',
    countryCode: 'IN',
    country: 'India',
    available: true,
  },
  {
    code: '62',
    countryCode: 'ID',
    country: 'Indonesia',
    available: true,
  },
  {
    code: '98',
    countryCode: 'IR',
    country: 'Iran',
    available: false,
  },
  {
    code: '964',
    countryCode: 'IQ',
    country: 'Iraq',
    available: false,
  },
  {
    code: '353',
    countryCode: 'IE',
    country: 'Ireland',
    available: true,
  },
  {
    code: '44',
    countryCode: 'IM',
    country: 'Isle of Man',
    available: true,
  },
  {
    code: '972',
    countryCode: 'IL',
    country: 'Israel',
    available: true,
  },
  {
    code: '39',
    countryCode: 'IT',
    country: 'Italy',
    available: true,
  },
  {
    code: '1876',
    countryCode: 'JM',
    country: 'Jamaica',
    available: false,
  },
  {
    code: '81',
    countryCode: 'JP',
    country: 'Japan',
    available: true,
  },
  {
    code: '962',
    countryCode: 'JO',
    country: 'Jordan',
    available: false,
  },
  {
    code: '7',
    countryCode: 'KZ',
    country: 'Kazakhstan',
    available: false,
  },
  {
    code: '254',
    countryCode: 'KE',
    country: 'Kenya',
    available: true,
  },
  {
    code: '686',
    countryCode: 'KI',
    country: 'Kiribati',
    available: true,
  },
  {
    code: '965',
    countryCode: 'KW',
    country: 'Kuwait',
    available: true,
  },
  {
    code: '996',
    countryCode: 'KG',
    country: 'Kyrgyzstan',
    available: false,
  },
  {
    code: '856',
    countryCode: 'LA',
    country: 'Laos',
    available: true,
  },
  {
    code: '371',
    countryCode: 'LV',
    country: 'Latvia',
    available: true,
  },
  {
    code: '961',
    countryCode: 'LB',
    country: 'Lebanon',
    available: false,
  },
  {
    code: '266',
    countryCode: 'LS',
    country: 'Lesotho',
    available: false,
  },
  {
    code: '231',
    countryCode: 'LR',
    country: 'Liberia',
    available: false,
  },
  {
    code: '218',
    countryCode: 'LY',
    country: 'Libya',
    available: false,
  },
  {
    code: '423',
    countryCode: 'LI',
    country: 'Liechtenstein',
    available: true,
  },
  {
    code: '370',
    countryCode: 'LT',
    country: 'Lithuania',
    available: true,
  },
  {
    code: '352',
    countryCode: 'LU',
    country: 'Luxembourg',
    available: true,
  },
  {
    code: '853',
    countryCode: 'MO',
    country: 'Macau',
    available: false,
  },
  {
    code: '389',
    countryCode: 'MK',
    country: 'Macedonia',
    available: true,
  },
  {
    code: '261',
    countryCode: 'MG',
    country: 'Madagascar',
    available: true,
  },
  {
    code: '265',
    countryCode: 'MW',
    country: 'Malawi',
    available: false,
  },
  {
    code: '60',
    countryCode: 'MY',
    country: 'Malaysia',
    available: true,
  },
  {
    code: '960',
    countryCode: 'MV',
    country: 'Maldives',
    available: true,
  },
  {
    code: '223',
    countryCode: 'ML',
    country: 'Mali',
    available: true,
  },
  {
    code: '356',
    countryCode: 'MT',
    country: 'Malta',
    available: true,
  },
  {
    code: '692',
    countryCode: 'MH',
    country: 'Marshall Islands',
    available: true,
  },
  {
    code: '596',
    countryCode: 'MQ',
    country: 'Martinique',
    available: false,
  },
  {
    code: '222',
    countryCode: 'MR',
    country: 'Mauritania',
    available: false,
  },
  {
    code: '230',
    countryCode: 'MU',
    country: 'Mauritius',
    available: true,
  },
  {
    code: '262',
    countryCode: 'YT',
    country: 'Mayotte',
    available: true,
  },
  {
    code: '52',
    countryCode: 'MX',
    country: 'Mexico',
    available: true,
  },
  {
    code: '691',
    countryCode: 'FM',
    country: 'Micronesia',
    available: true,
  },
  {
    code: '373',
    countryCode: 'MD',
    country: 'Moldova',
    available: false,
  },
  {
    code: '377',
    countryCode: 'MC',
    country: 'Monaco',
    available: true,
  },
  {
    code: '976',
    countryCode: 'MN',
    country: 'Mongolia',
    available: false,
  },
  {
    code: '382',
    countryCode: 'ME',
    country: 'Montenegro',
    available: false,
  },
  {
    code: '1664',
    countryCode: 'MS',
    country: 'Montserrat',
    available: true,
  },
  {
    code: '212',
    countryCode: 'MA',
    country: 'Morocco',
    available: true,
  },
  {
    code: '258',
    countryCode: 'MZ',
    country: 'Mozambique',
    available: true,
  },
  {
    code: '95',
    countryCode: 'MM',
    country: 'Myanmar (Burma)',
    available: false,
  },
  {
    code: '264',
    countryCode: 'NA',
    country: 'Namibia',
    available: false,
  },
  {
    code: '674',
    countryCode: 'NR',
    country: 'Nauru',
    available: true,
  },
  {
    code: '977',
    countryCode: 'NP',
    country: 'Nepal',
    available: true,
  },
  {
    code: '31',
    countryCode: 'NL',
    country: 'Netherlands',
    available: true,
  },
  {
    code: '687',
    countryCode: 'NC',
    country: 'New Caledonia',
    available: true,
  },
  {
    code: '64',
    countryCode: 'NZ',
    country: 'New Zealand',
    available: true,
  },
  {
    code: '505',
    countryCode: 'NI',
    country: 'Nicaragua',
    available: true,
  },
  {
    code: '227',
    countryCode: 'NE',
    country: 'Niger',
    available: false,
  },
  {
    code: '234',
    countryCode: 'NG',
    country: 'Nigeria',
    available: true,
  },
  {
    code: '683',
    countryCode: 'NU',
    country: 'Niue',
    available: true,
  },
  {
    code: '672',
    countryCode: 'NF',
    country: 'Norfolk Island',
    available: true,
  },
  {
    code: '850',
    countryCode: 'KP',
    country: 'North Korea',
    available: false,
  },
  {
    code: '1670',
    countryCode: 'MP',
    country: 'Northern Mariana Islands',
    available: true,
  },
  {
    code: '47',
    countryCode: 'NO',
    country: 'Norway',
    available: true,
  },
  {
    code: '968',
    countryCode: 'OM',
    country: 'Oman',
    available: true,
  },
  {
    code: '92',
    countryCode: 'PK',
    country: 'Pakistan',
    available: false,
  },
  {
    code: '680',
    countryCode: 'PW',
    country: 'Palau',
    available: true,
  },
  {
    code: '970',
    countryCode: 'PS',
    country: 'Palestinian Territories',
    available: false,
  },
  {
    code: '507',
    countryCode: 'PA',
    country: 'Panama',
    available: false,
  },
  {
    code: '675',
    countryCode: 'PG',
    country: 'Papua New Guinea',
    available: true,
  },
  {
    code: '595',
    countryCode: 'PY',
    country: 'Paraguay',
    available: true,
  },
  {
    code: '51',
    countryCode: 'PE',
    country: 'Peru',
    available: true,
  },
  {
    code: '63',
    countryCode: 'PH',
    country: 'Philippines',
    available: true,
  },
  {
    code: '48',
    countryCode: 'PL',
    country: 'Poland',
    available: true,
  },
  {
    code: '351',
    countryCode: 'PT',
    country: 'Portugal',
    available: true,
  },
  {
    code: '1787',
    countryCode: 'PR',
    country: 'Puerto Rico',
    available: true,
  },
  {
    code: '974',
    countryCode: 'QA',
    country: 'Qatar',
    available: true,
  },
  {
    code: '262',
    countryCode: 'RE',
    country: 'Réunion',
    available: true,
  },
  {
    code: '40',
    countryCode: 'RO',
    country: 'Romania',
    available: false,
  },
  {
    code: '7',
    countryCode: 'RU',
    country: 'Russia',
    available: false,
  },
  {
    code: '250',
    countryCode: 'RW',
    country: 'Rwanda',
    available: false,
  },
  {
    code: '590',
    countryCode: 'BL',
    country: 'Saint Barthélemy',
    available: true,
  },
  {
    code: '290',
    countryCode: 'SH',
    country: 'Saint Helena',
    available: true,
  },
  {
    code: '1869',
    countryCode: 'KN',
    country: 'St. Kitts',
    available: true,
  },
  {
    code: '1758',
    countryCode: 'LC',
    country: 'St. Lucia',
    available: true,
  },
  {
    code: '590',
    countryCode: 'MF',
    country: 'Saint Martin',
    available: true,
  },
  {
    code: '508',
    countryCode: 'PM',
    country: 'Saint Pierre and Miquelon',
    available: true,
  },
  {
    code: '1784',
    countryCode: 'VC',
    country: 'St. Vincent',
    available: true,
  },
  {
    code: '685',
    countryCode: 'WS',
    country: 'Samoa',
    available: true,
  },
  {
    code: '378',
    countryCode: 'SM',
    country: 'San Marino',
    available: true,
  },
  {
    code: '239',
    countryCode: 'ST',
    country: 'São Tomé and Príncipe',
    available: false,
  },
  {
    code: '966',
    countryCode: 'SA',
    country: 'Saudi Arabia',
    available: true,
  },
  {
    code: '221',
    countryCode: 'SN',
    country: 'Senegal',
    available: false,
  },
  {
    code: '381',
    countryCode: 'RS',
    country: 'Serbia',
    available: true,
  },
  {
    code: '248',
    countryCode: 'SC',
    country: 'Seychelles',
    available: false,
  },
  {
    code: '232',
    countryCode: 'SL',
    country: 'Sierra Leone',
    available: false,
  },
  {
    code: '65',
    countryCode: 'SG',
    country: 'Singapore',
    available: true,
  },
  {
    code: '1',
    countryCode: 'SX',
    country: 'Sint Maarten',
    available: true,
  },
  {
    code: '421',
    countryCode: 'SK',
    country: 'Slovakia',
    available: true,
  },
  {
    code: '386',
    countryCode: 'SI',
    country: 'Slovenia',
    available: true,
  },
  {
    code: '677',
    countryCode: 'SB',
    country: 'Solomon Islands',
    available: true,
  },
  {
    code: '252',
    countryCode: 'SO',
    country: 'Somalia',
    available: false,
  },
  {
    code: '27',
    countryCode: 'ZA',
    country: 'South Africa',
    available: true,
  },
  {
    code: '500',
    countryCode: 'GS',
    country: 'South Georgia and the South Sandwich Islands',
    available: true,
  },
  {
    code: '82',
    countryCode: 'KR',
    country: 'South Korea',
    available: true,
  },
  {
    code: '211',
    countryCode: 'SS',
    country: 'South Sudan',
    available: false,
  },
  {
    code: '34',
    countryCode: 'ES',
    country: 'Spain',
    available: true,
  },
  {
    code: '94',
    countryCode: 'LK',
    country: 'Sri Lanka',
    available: true,
  },
  {
    code: '249',
    countryCode: 'SD',
    country: 'Sudan',
    available: false,
  },
  {
    code: '597',
    countryCode: 'SR',
    country: 'Suriname',
    available: false,
  },
  {
    code: '47',
    countryCode: 'SJ',
    country: 'Svalbard and Jan Mayen',
    available: true,
  },
  {
    code: '268',
    countryCode: 'SZ',
    country: 'Swaziland',
    available: true,
  },
  {
    code: '46',
    countryCode: 'SE',
    country: 'Sweden',
    available: true,
  },
  {
    code: '41',
    countryCode: 'CH',
    country: 'Switzerland',
    available: true,
  },
  {
    code: '963',
    countryCode: 'SY',
    country: 'Syria',
    available: false,
  },
  {
    code: '886',
    countryCode: 'TW',
    country: 'Taiwan',
    available: true,
  },
  {
    code: '992',
    countryCode: 'TJ',
    country: 'Tajikistan',
    available: false,
  },
  {
    code: '255',
    countryCode: 'TZ',
    country: 'Tanzania',
    available: false,
  },
  {
    code: '66',
    countryCode: 'TH',
    country: 'Thailand',
    available: true,
  },
  {
    code: '228',
    countryCode: 'TG',
    country: 'Togo',
    available: false,
  },
  {
    code: '690',
    countryCode: 'TK',
    country: 'Tokelau',
    available: true,
  },
  {
    code: '676',
    countryCode: 'TO',
    country: 'Tonga',
    available: true,
  },
  {
    code: '1868',
    countryCode: 'TT',
    country: 'Trinidad/Tobago',
    available: true,
  },
  {
    code: '216',
    countryCode: 'TN',
    country: 'Tunisia',
    available: true,
  },
  {
    code: '90',
    countryCode: 'TR',
    country: 'Turkey',
    available: true,
  },
  {
    code: '993',
    countryCode: 'TM',
    country: 'Turkmenistan',
    available: false,
  },
  {
    code: '1649',
    countryCode: 'TC',
    country: 'Turks and Caicos Islands',
    available: true,
  },
  {
    code: '688',
    countryCode: 'TV',
    country: 'Tuvalu',
    available: true,
  },
  {
    code: '1340',
    countryCode: 'VI',
    country: 'U.S. Virgin Islands',
    available: true,
  },
  {
    code: '256',
    countryCode: 'UG',
    country: 'Uganda',
    available: true,
  },
  {
    code: '380',
    countryCode: 'UA',
    country: 'Ukraine',
    available: false,
  },
  {
    code: '971',
    countryCode: 'AE',
    country: 'United Arab Emirates',
    available: true,
  },
  {
    code: '44',
    countryCode: 'GB',
    country: 'United Kingdom',
    available: true,
  },
  {
    code: '1',
    countryCode: 'US',
    country: 'United States',
    available: true,
  },
  {
    code: '598',
    countryCode: 'UY',
    country: 'Uruguay',
    available: false,
  },
  {
    code: '998',
    countryCode: 'UZ',
    country: 'Uzbekistan',
    available: false,
  },
  {
    code: '678',
    countryCode: 'VU',
    country: 'Vanuatu',
    available: true,
  },
  {
    code: '379',
    countryCode: 'VA',
    country: 'Vatican City',
    available: true,
  },
  {
    code: '58',
    countryCode: 'VE',
    country: 'Venezuela',
    available: false,
  },
  {
    code: '84',
    countryCode: 'VN',
    country: 'Vietnam',
    available: true,
  },
  {
    code: '681',
    countryCode: 'WF',
    country: 'Wallis and Futuna',
    available: true,
  },
  {
    code: '212',
    countryCode: 'EH',
    country: 'Western Sahara',
    available: true,
  },
  {
    code: '967',
    countryCode: 'YE',
    country: 'Yemen',
    available: true,
  },
  {
    code: '260',
    countryCode: 'ZM',
    country: 'Zambia',
    available: false,
  },
  {
    code: '263',
    countryCode: 'ZW',
    country: 'Zimbabwe',
    available: true,
  },
]);

export default codes;
