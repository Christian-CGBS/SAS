module.exports = function(app) {
    app.get('/entrada', function(req,res){
        app.app.controllers.diagnostico.entrada(app, req, res);
    });

    app.post('/entrada/salvar', function(req,res){
        app.app.controllers.diagnostico.entrada_salvar(app, req, res);
    });

    app.get('/saida', function(req,res){
        app.app.controllers.diagnostico.saida(app, req, res);
    });

    app.get('/saida_vazia', function(req,res){
        app.app.controllers.diagnostico.saida_vazia(app, req, res);
    });
}