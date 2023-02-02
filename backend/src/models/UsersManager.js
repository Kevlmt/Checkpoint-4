/* eslint-disable class-methods-use-this */
const argon2 = require("argon2");
const AbstractManager = require("./AbstractManager");

class UsersManager extends AbstractManager {
  static table = "users";

  hashPassword(usersPassword) {
    return argon2.hash(usersPassword);
  }

  verifyPassword(usersPassword, hashedPassword) {
    return argon2.verify(hashedPassword, usersPassword);
  }

  async passwordCheck(email, userPassword) {
    const password = await this.connection.query(
      `SELECT password FROM ${UsersManager.table} WHERE email = ?`,
      [email]
    );
    return this.verifyPassword(userPassword, password[0][0].password);
  }

  emailAlreadyExist(email) {
    return this.connection
      .query(`SELECT * FROM ${UsersManager.table} WHERE email = ?`, [email])
      .then(([result]) => result.length);
  }

  async findByEmail(email) {
    const user = await this.connection.query(
      `SELECT id, firstname, lastname, email, pseudo, imgLink, role FROM ${UsersManager.table} WHERE email = ?`,
      [email]
    );
    return user[0];
  }

  async find(id, userId) {
    if (userId === id) {
      return this.connection.query(
        `SELECT id, firstname, lastname, email, pseudo , imgLink, role FROM ${UsersManager.table} WHERE id = ?`,
        [id]
      );
    }
    return this.connection.query(
      `SELECT firstname, lastname, email, pseudo , imgLink FROM ${UsersManager.table} WHERE id = ?`,
      [id]
    );
  }

  async findById(id) {
    const user = await this.connection.query(
      `SELECT * FROM ${UsersManager.table} WHERE id = ?`,
      [id]
    );
    return user[0];
  }

  findAll() {
    return this.connection.query(
      `SELECT id, firstname, lastname, pseudo, imgLink, email FROM ${UsersManager.table}`
    );
  }

  findAllChat() {
    return this.connection.query(
      `SELECT u.id, u.firstname, u.lastname, u.pseudo, u.imgLink, u.email,m.text lastMessageSent, m.date lastMessageDateSent, me.text lastMessageReceived, me.date lastMessageDateReceived FROM ${UsersManager.table} u LEFT JOIN messages m ON m.fromId = u.id OR m.toId = u.id`
    );
  }

  findAllAdmin() {
    return this.connection.query(
      `SELECT * FROM ${UsersManager.table} WHERE role = "USER"`
    );
  }

  insert(user) {
    return this.connection.query(`INSERT INTO ${UsersManager.table} SET ?`, [
      user,
    ]);
  }

  update(user) {
    return this.connection.query(
      `UPDATE ${UsersManager.table} SET ? WHERE id = ?`,
      [user, user.id]
    );
  }

  delete(userId) {
    return this.connection.query(
      `DELETE FROM ${UsersManager.table} WHERE id = ?`,
      userId
    );
  }

  findImgToDelete(userId) {
    return this.connection
      .query(`SELECT imgLink FROM ${UsersManager.table} WHERE id = ?`, [userId])
      .then(([result]) => result[0]);
  }
}

module.exports = UsersManager;
