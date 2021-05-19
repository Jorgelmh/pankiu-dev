module.exports = {
  up: `CREATE TABLE IF NOT EXISTS counselors (
                id_counselor INT NOT NULL AUTO_INCREMENT,
                university VARCHAR(100) NOT NULL,
                isgraduated TINYINT NOT NULL,
                user_id INT NOT NULL,
                PRIMARY KEY (id_counselor),
                UNIQUE (id_counselor),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )`,
  down: "DROP TABLE IF EXISTS counselors",
};
