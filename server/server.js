const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const PORT = 5000;

const Pool = pg.Pool;

const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost'
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

pool.on('connect', () =>    {
    console.log('PG connected.');
});

pool.on('error', (error =>  {
    console.log('ruh roh', error);
}))

// TODO - Replace static content with a database tables
// const artistList = [ 
//     {
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },       
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [
//     {
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

app.get('/artist', (req, res) => {
    const sqlText = 'SELECT * FROM artist;'
    pool.query(sqlText)
      .then((dbRes) => {
        const artistsFromDb = dbRes.rows;
        res.send(artistsFromDb)
      }).catch((dbErr) => {
        console.error(dbErr);
      });
  });


  app.post('/artist', (req, res) => {
    const newArtist = req.body;
    const sqlText = (`
      INSERT INTO "artist"
        ("name", "birthDate")
      VALUES
        ($1, $2);
    `)
    const sqlValues = [
      newArtist.name,
      newArtist.birthDate
    ]
    console.log(sqlText)
    pool.query(sqlText, sqlValues)
      .then((dbRes) => {
        res.sendStatus(201);  
      })
      .catch((dbErr) => {
        console.error(dbErr);
      })
  });

app.get('/song', (req, res) => {
    const sqlText = 'SELECT * FROM song;'
    pool.query(sqlText)
      .then((dbRes) => {
        const songsFromDb = dbRes.rows;
        res.send(songsFromDb)
      }).catch((dbErr) => {
        console.error(dbErr);
      });
  });

app.post('/song', (req, res) => {
    const newSong = req.body;
    const sqlText = (`
      INSERT INTO "song"
        ("title", "length", "released")
      VALUES
        ($1, $2, $3);
    `)
    const sqlValues = [
      newSong.title,
      newSong.length,
      newSong.released
    ]
    console.log(sqlText)
    pool.query(sqlText, sqlValues)
      .then((dbRes) => {
        res.sendStatus(201);  
      })
      .catch((dbErr) => {
        console.error(dbErr);
      })
  });
  