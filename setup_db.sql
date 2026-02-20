-- =============================================================
-- Kodbank Database Setup Script
-- Run this once against your Aiven MySQL (defaultdb)
-- =============================================================

-- Table 1: KodUser
CREATE TABLE IF NOT EXISTS KodUser (
  uid       VARCHAR(50)   NOT NULL PRIMARY KEY,
  username  VARCHAR(100)  NOT NULL UNIQUE,
  email     VARCHAR(150)  NOT NULL UNIQUE,
  password  VARCHAR(255)  NOT NULL,
  balance   DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
  phone     VARCHAR(20)   NOT NULL,
  role      ENUM('Customer','manager','admin') NOT NULL DEFAULT 'Customer'
);

-- Table 2: UserToken
CREATE TABLE IF NOT EXISTS UserToken (
  tid     INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  token   TEXT          NOT NULL,
  uid     VARCHAR(50)   NOT NULL,
  expiry  DATETIME      NOT NULL,
  CONSTRAINT fk_usertoken_uid FOREIGN KEY (uid) REFERENCES KodUser(uid)
    ON DELETE CASCADE ON UPDATE CASCADE
);
