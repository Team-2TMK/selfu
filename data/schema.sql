
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS results;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    city VARCHAR(255)
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES users(id),
    dateitemone VARCHAR(255),
    dateitemtwo VARCHAR(255),
    dateitemthree VARCHAR(255),
    rating INTEGER

);

