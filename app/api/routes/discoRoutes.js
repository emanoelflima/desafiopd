'use strict';

module.exports = function(router){

    var discoCRUD = require('../controllers/discoController');

    router.get('/', (req, res) => res.json({ message: 'Ok!'}));

    router.get('/disco', (req, res) => {
        return discoCRUD.get(req, res);
    });

    router.get('/disco/:id?', (req, res) => {
        return discoCRUD.get(req, res);
    });

    router.delete('/disco/:id', (req, res) => {
        return discoCRUD.delete(req, res);
    });

    router.post('/disco', (req, res) => {
        return discoCRUD.post(req, res);
    });

    router.put('/disco/:id', (req, res) => {
        return discoCRUD.put(req, res);
    });
};