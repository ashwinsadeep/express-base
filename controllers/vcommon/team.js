/**
 * @author: Ashwin
 * Team controller which will serve all /team/.* endpoints
 * @param router
 */
module.exports = function (router) {

    var _someLongRunningJob = function(callback){
        setTimeout(callback, 10000);
    };

    router.get('/create', function (req, res) {
        console.log('blah');
        _someLongRunningJob(function(){
            res.send('Create')
        })
    });

    router.get('/edit', function (req, res) {
        res.send('Edit');
    });

};