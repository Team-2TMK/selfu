DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS results CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    city VARCHAR(255)
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES users(id),
    dateitemone JSON,
    dateitemtwo JSON,
    dateitemthree JSON,
    rating INTEGER
);
