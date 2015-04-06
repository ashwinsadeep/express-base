/**
 * @author: Ashwin
 * Team controller which will serve all /team/.* endpoints
 * @param router
 */
module.exports = function (router) {

    router.get('/create', function (req, res) {
        res.send('Create v5');
    });

};
