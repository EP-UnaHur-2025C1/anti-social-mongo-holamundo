const swaggerInit = (app) => {
    //Archivo Swagger
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    const path = require('path');
    // Carga el archivo swagger.yaml
    const swaggerDocument = YAML.load(path.join(__dirname, 'docker.compose.yaml'));
    // Middleware para exponer la doc
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = swaggerInit;