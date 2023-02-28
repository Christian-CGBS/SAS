module.exports = function(app) {
    app.get('/final', function(req,res){
        app.app.controllers.final.final(app, req, res);
    });
}