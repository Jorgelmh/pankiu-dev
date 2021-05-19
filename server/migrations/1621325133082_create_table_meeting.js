module.exports = {
  up: `CREATE TABLE IF NOT EXISTS meetings (
                user_id1 INT,
                user_id2 INT,
                timestart DATETIME NOT NULL,
                timeend DATETIME NOT NULL,
                PRIMARY KEY (user_id1, user_id2, timestart),
                FOREIGN KEY (user_id1) REFERENCES users (id)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
                FOREIGN KEY (user_id2) REFERENCES users  (id)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION
            )`,
  down: "DROP TABLE IF EXISTS meetings",
};
