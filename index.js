const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = config.port;
const sqlite3 = require("sqlite3").verbose();

app.use(cors());

app.get("/keywords/:id", (req, res) => {
    const keywords = [];

    let db = new sqlite3.Database(config.connectionString);

    db.each(
        `SELECT Keyword, CommentText FROM Keywords WHERE SubredditId = ? OR SubredditId = 'global'`,
        [req.params.id],
        (err, row) => {
            if (err) {
                throw err;
            }
            keywords.push(row);
        },
        (err, i) => {
            if (err) {
                throw err;
            }
            console.log(`Total keywords: ${i}`);
            res.send(keywords);
        }
    );

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

app.get("/subreddits", (req, res) => {
    const subreddits = [];

    let db = new sqlite3.Database(config.connectionString);

    db.each(
        `SELECT Id, SubredditId, Name, Enabled FROM Subreddits`,
        (err, row) => {
            if (err) {
                throw err;
            }
            subreddits.push(row);
        },
        (err, i) => {
            if (err) {
                throw err;
            }
            console.log(`Total subreddits: ${i}`);
            res.send(subreddits);
        }
    );

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
