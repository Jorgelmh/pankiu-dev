module.exports = {
  up: `CREATE TABLE IF NOT EXISTS patients (
                id_patient INT NOT NULL AUTO_INCREMENT,
                mood VARCHAR(45) NOT NULL,
                user_id INT NOT NULL,
                PRIMARY KEY (id_patient),
                UNIQUE (id_patient),
                UNIQUE (user_id),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )`,
  down: "DROP TABLE IF EXISTS patients",
};
