module.exports = function(app) {
    app.get('/index', function(req,res){
        app.app.controllers.index.index(app, req, res);
    });
}