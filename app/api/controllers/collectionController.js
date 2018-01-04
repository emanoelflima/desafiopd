'use strict';

const config = require('../../config/config-std.json');
const mysql  = require('mysql');

exports.get = function(req, res){
    if(req.params.id){
        var find = [parseInt(req.params.id)];
        this.execSQLQuery(`SELECT * FROM catalog WHERE id = ?`, res, find);
    }
    else{
        this.execSQLQuery(`SELECT * FROM catalog`, res);
    }
}

exports.detail = function(req, res){    
    var find = [parseInt(req.params.id)];
    this.execSQLQuery(`SELECT * FROM disco WHERE id IN (SELECT disco_id FROM catalog_disco WHERE catalog_id = ?)`, res, find);
}

exports.post = function(req, res){
    const name = req.body.name;
    var err = {};
    if(name == null){
        err.message = "Name is missing.";
        err.status = 500;
        res.status(500).send(err);
    }
    else{
        const connection = createConnection();
        var SQLQuery = `SELECT COUNT(*) total FROM catalog WHERE name = ?`;
        var find = [name];
        var that = this;
        connection.query(SQLQuery, find, function(error, results, fields){
            if(error){
                console.log('Erro ao executar query.', error);
                res.json(error);
            }
            else{
                var rows = JSON.parse(JSON.stringify(results[0]));
                var count = rows["total"];
                if(count == 0){
                    SQLQuery = `INSERT INTO catalog (name) VALUES (?)`;
                    var insert = [name];
                    return that.execSQLQuery(SQLQuery, res, insert);
                }
                else{
                    var error = {};
                    error.errno = 2627;
                    error.message = "Register already exists.";
                    res.json(error);
                }
            }
        });
    }
}

exports.assoc = function(req, res){
    const catalogId = req.params.id;
    const discoId = req.body.discoId;
    if(discoId == null){
        var err = {};
        err.message = "discoId is missing.";
        err.status = 500;
        res.status(500).send(err);
    }
    else{
        var SQLQuery = `INSERT INTO catalog_disco (catalog_id, disco_id) VALUES (?, ?)`;
        var insert = [catalogId, discoId];
        return this.execSQLQuery(SQLQuery, res, insert);
    }
}

exports.dissoc = function(req, res){
    const catalogId = req.params.id;
    const discoId = req.body.discoId;
    var SQLQuery = `DELETE FROM catalog_disco WHERE catalog_id = ? AND disco_id = ?`;
    var insert = [catalogId, discoId];
    return this.execSQLQuery(SQLQuery, res, insert);
}

exports.put = function(req, res){
    const name = req.body.name;
    var err = {};
    if(name == null){
        err.message = "name is missing.";
        err.status = 500;
        res.status(500).send(err);
    }
    else{
        const connection = createConnection();
        var SQLQuery = `SELECT COUNT(*) total FROM catalog WHERE name = ?`;
        var find = [name];
        var that = this;
        connection.query(SQLQuery, find, function(error, results, fields){
            if(error){
                console.log('Erro ao executar query.', error);
                res.json(error);
            }
            else{
                var id = req.params.id;
                var rows = JSON.parse(JSON.stringify(results[0]));
                var count = rows["total"];
                if(count == 0){
                    SQLQuery = `UPDATE catalog SET name = ? WHERE id = ?`;
                    var insert = [name, id];
                    return that.execSQLQuery(SQLQuery, res, insert);
                }
                else{
                    var error = {};
                    error.errno = 2627;
                    error.message = "Register already exists.";
                    res.json(error);
                }
            }
        });
    }
}


exports.execSQLQuery = function(SQLQuery, res, find){
    const connection = createConnection();
    connection.query(SQLQuery, find, function(error, results, fields){
        if(error){
            res.json(error);
        }
        else{
            res.json(results);
        }
        connection.end();
    });
}

/** todo */
exports.delete = function(req, res){
    if(req.params.id){
        const connection = createConnection();
        var SQLQuery = `DELETE FROM catalog_disco WHERE catalog_id = ?`;
        let find = [parseInt(req.params.id)];
        var that = this;
        connection.query(SQLQuery, find, function(error, results, fields){
            if(error){
                res.json(error);
            }
            else{
                return that.execSQLQuery(`DELETE FROM catalog WHERE id = ?`, res, find);
            }
        });
    }
}

function createConnection(){
    return mysql.createConnection({
        host: config.db.ip,
        port: config.db.port,
        user: config.db.user,
        password: config.db.pwd,
        database: config.db.dbname
    });
}