const nextLinks = require('next-links').default;

const routes = nextLinks();

routes.add('home', '/');
routes.add('agreement', '/agreement');
routes.add('communities', '/communities');
routes.add('messenger', '/messenger');
routes.add('policy', '/policies/:policy');
routes.add('post', '/:communityId/@:username/:permlink');
routes.add('trending', '/trending');
routes.add('profile', '/@:username');
routes.add('profileSection', '/@:username/:section', 'profile');
routes.add('new', '/new');
routes.add('wallet', '/wallet');
routes.add('walletSection', '/wallet/:section', 'wallet');
routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
routes.add('notifications', '/notifications');
routes.add('community', '/:communityId(id[1-9][0-9]+)');
routes.add('communitySection', '/:communityId(id[1-9][0-9]+)/:section', 'community');

module.exports = routes;
