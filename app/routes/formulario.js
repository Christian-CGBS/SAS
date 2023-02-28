module.exports = function(app) {
    app.get('/formulario', function(req,res){
        app.app.controllers.formulario.formulario(app, req, res);
    });

    app.post('/questoes/salvar', function(req, res){
        app.app.controllers.formulario.questoes_salvar(app, req, res);
});
}