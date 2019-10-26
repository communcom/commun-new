const nextLinks = require('next-links').default;

const routes = nextLinks();

routes.add('home', '/');
routes.add('feed', '/feed/:feedType', 'home');
routes.add('agreement', '/agreement');
routes.add('communities', '/communities');
routes.add('messenger', '/messenger');
routes.add('policy', '/policies/:policy');
routes.add('trending', '/trending');
routes.add('profile', '/@:username/:section?');
routes.add('wallet', '/wallet');
routes.add('walletSection', '/wallet/:section', 'wallet');
routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
routes.add('notifications', '/notifications');
routes.add('post', '/:communityAlias(id[1-9][0-9]+)/@:username/:permlink');
routes.add('community', '/:communityAlias(id[1-9][0-9]+)/:section?/:subSection?');

module.exports = routes;
