const fs = require("node:fs/promises");
const sql = require("better-sqlite3");
const db = sql("e-comerce.db");
const pkg = require("bcryptjs");
const { compare } = pkg;
const { insertUser } = require("./insertActions");

async function getUser(user) {
  const userRet = db
    .prepare("SELECT * FROM users WHERE email_address = ?")
    .get(user.email);
  switch (user.confUser) {
    case "yes":
      return userRet;
    default:
      if (!userRet) {
        user.message = "Could not find user";
        return user;
      } else {
        const isValid = await compare(user.password, userRet.password);
        if (isValid) {
          return userRet;
        } else {
          user.message = "Wrong Password";
          return user;
        }
      }
  }
}

async function newUser(user) {
  const conf = await getUser({
    email: user.email_address,
    password: user.password,
    confUser: "yes",
  });
  if (!conf) {
    insertUser(user);
    return user;
  } else {
    user.message = "user already registered";
    return user;
  }
}
exports.newUser = newUser;
exports.getUser = getUser;
// export function deleteUser(email, id) {
//   deleteOrders(id);
//   deleteCart(id);
//   deleteProduct(id);

//   const stmt = db.prepare("DELETE  FROM users WHERE email_address = ?");
//   const ret = stmt.run(email);
//   console.log("deleteUser======================================");

//   console.log(ret);
// }

// export function updateUserData({ newEmail, first, last, email }) {
//   let stmt = db.prepare(
//     `UPDATE users  SET email_address=?,first_name=?, last_name=? WHERE email_address  = ?`,
//   );
//   const ret = stmt.run(newEmail, first, last, email);
//   console.log(ret);
// }

// export async function changePassword(newPassword, email) {
//   const password = await hash(newPassword, 12);

//   let stmt = db.prepare(
//     `UPDATE users  SET password =? WHERE email_address  = ?`,
//   );
//   const ret = stmt.run(password, email);
//   console.log(ret);
// }
