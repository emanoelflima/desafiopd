'use strict';

const config = require('../../config/config-std.json');
const mysql  = require('mysql');

exports.get = function(req, res){
    if(req.params.id){
        var isnum = new RegExp(/^\d+$/);
        if(isnum.test(req.params.id)){
            var find = [parseInt(req.params.id)];
            this.execSQLQuery(`SELECT * FROM disco WHERE ID = ?`, res, find);
        }
        else{
            var likeParam = "%" + req.params.id + "%";
            var find = [likeParam, likeParam];
            this.execSQLQuery("SELECT * FROM disco WHERE name LIKE ? OR artist LIKE ?", res, find);
        }
    }
    else{
        this.execSQLQuery('SELECT * FROM disco', res);
    }
}

exports.post = function(req, res){
    const name = req.body.name;
    const artist = req.body.artist;
    const duration = req.body.duration;
    const cover = req.body.cover;
    var err = {};
    if(name == null){
        err.message = "Name is missing";
        err.status = 500;
        res.status(500).send(err);
    }
    else if(artist == null){
        err.message = "Artist is missing";
        err.status = 500;
        res.status(500).send(err);
    }
    else if(duration == null){
        err.message = "Duration is missing";
        err.status = 500;
        res.status(500).send(err);
    }
    else if(cover == null){
        err.message = "Cover is missing";
        err.status = 500;
        res.status(500).send(err);
    }
    else{
        const connection = createConnection();
        var SQLQuery = `SELECT COUNT(*) total FROM disco WHERE name = ? AND artist = ?`;
        var find = [name, artist];
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
                    SQLQuery = `INSERT INTO disco (name, artist, duration, cover) VALUES (?, ?, ?, ?)`;
                    var insert = [name, artist, duration, cover];
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

exports.put = function(req, res){
    const name = req.body.name;
    const artist = req.body.artist;
    const duration = req.body.duration;
    const cover = req.body.cover;
    var err = {};
    if(name == null && artist == null && duration == null && cover == null){
        err.message = "No data was sent.";
        err.status = 500;
        res.status(500).send(err);
    }
    else{
        const connection = createConnection();
        var find = [];
        var SQLQuery = `UPDATE disco SET `;// WHERE name = ? AND artist = ?`;
        if(name != null){
            SQLQuery += `name = ?, `;
            find.push(name);
        }
        if(artist != null){
            SQLQuery += `artist = ?, `;
            find.push(artist);
        }
        if(duration != null){
            SQLQuery += `duration = ?, `;
            find.push(duration);
        }
        if(cover != null){
            SQLQuery += `cover = ?, `;
            find.push(cover);
        }

        find.push(req.params.id);

        SQLQuery = SQLQuery.substr(0, SQLQuery.length - 2);
        SQLQuery += ` WHERE id = ?`;
        
        return this.execSQLQuery(SQLQuery, res, find);
    }
}

exports.execSQLQuery = function(SQLQuery, res, find){
    const connection = createConnection();
    connection.query(SQLQuery, find, function(error, results, fields){
        if(error){
            console.log('Erro ao executar query.', error);
            res.json(error);
        }
        else{
            res.json(results);
        }
        connection.end();
    });
}

exports.delete = function(req, res){
    if(req.params.id){
        let find = [parseInt(req.params.id)];
        this.execSQLQuery('DELETE FROM disco WHERE ID = ? ', res, find);
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