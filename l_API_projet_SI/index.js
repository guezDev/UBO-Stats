const express = require('express')
const app = express()
const mariadb = require('mariadb');
const cors=require('cors');

app.use(cors({origin: '*'}));

require('dotenv').config()
const connexion = mariadb.createConnection({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PWD });

app.get('/ufrs', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT idUFR,nomUFR_court FROM UFR")
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.get('/departements/:idUFR', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT idDept, nomDept FROM DEPARTEMENT WHERE idUFR=?",[req.params.idUFR])
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.get('/types_formation/:idDept', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT DISTINCT(type) FROM FORMATION WHERE idDept=?",[req.params.idDept])
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.get('/niveaux_formation/:type', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT DISTINCT(niveau) FROM FORMATION WHERE type=?",[req.params.type])
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.get('/parcours_formation/:type/:niveau', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT nomParcours FROM FORMATION INNER JOIN PARCOURS ON FORMATION.idParcours=PARCOURS.idParcours WHERE type=? AND niveau= ?",[req.params.type, req.params.niveau])
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.get('/annees', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT DISTINCT(anneeFormation) FROM EFFECTIF")
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.get('/idFormation/:type/:niveau/:parcours', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT idFormation FROM FORMATION INNER JOIN PARCOURS ON FORMATION.idParcours=PARCOURS.idParcours WHERE type=? AND niveau=? AND nomParcours=?",[req.params.type, req.params.niveau, req.params.parcours])
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})


app.get('/effectifs/:annee/:formation', (req,res) => {
    connexion
    .then(conn => {
        conn.query("SELECT effectif FROM EFFECTIF WHERE anneeFormation=? AND idFormation=?",[req.params.annee, req.params.formation])
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.listen(3000, (req,res) => {
    console.log("Serveur à l'écoute");
})