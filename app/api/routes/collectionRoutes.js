'use strict';

module.exports = function(router){

    var collectionCRUD = require('../controllers/collectionController');

    router.get('/', (req, res) => res.json({ message: 'Ok!'}));

    router.get('/collection', (req, res) => {
        return collectionCRUD.get(req, res);
    });

    router.get('/collection/:id', (req, res) => {
        return collectionCRUD.detail(req, res);
    });

    router.delete('/collection/:id', (req, res) => {
        if(req.body.discoId == null){
            return collectionCRUD.delete(req, res);    
        }
        else{
            return collectionCRUD.dissoc(req, res);
        }
    });

    router.post('/collection', (req, res) => {
        return collectionCRUD.post(req, res);
    });

    router.post('/collection/:id', (req, res) => {
        return collectionCRUD.assoc(req, res);
    });

    router.put('/collection/:id', (req, res) => {
        return collectionCRUD.put(req, res);
    });
};