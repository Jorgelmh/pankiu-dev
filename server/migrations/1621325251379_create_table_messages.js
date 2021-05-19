module.exports = {
  up: `CREATE TABLE IF NOT EXISTS messages (
                id_message INT NOT NULL AUTO_INCREMENT,
                time DATETIME NOT NULL,
                message VARCHAR(500) NOT NULL,
                receiver_id INT NOT NULL,
                sender_id INT NOT NULL,
                PRIMARY KEY (id_message),
                UNIQUE (id_message),
                FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )`,
  down: "DROP TABLE IF EXISTS messages",
};
