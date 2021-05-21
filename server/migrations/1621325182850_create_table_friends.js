module.exports = {
  up: `CREATE TABLE IF NOT EXISTS friends (
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                accepted TINYINT(1) NOT NULL,
                date DATETIME NOT NULL,
                PRIMARY KEY (sender_id, receiver_id),
                FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
                FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )`,
  down: "DROP TABLE IF EXISTS friends",
};
