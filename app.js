var app = require('./config/server');

require("dotenv").config();

app.listen(3000, function(){
    console.log('servidor ON');
});

/* para o deploy da aplicação
app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log('servidor está ativo!')
}) */