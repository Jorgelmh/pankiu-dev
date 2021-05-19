module.exports = {
  up: `CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(250) NOT NULL,
                password VARCHAR(255) NOT NULL,
                username VARCHAR(45) NOT NULL,
                isadmin TINYINT NOT NULL,
                PRIMARY KEY (id),
                UNIQUE (id),
                UNIQUE (email),
                UNIQUE (username)
            )`,
  down: "DROP TABLE IF EXISTS users",
};
