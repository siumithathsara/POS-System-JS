import { userDB } from "../db/db.js";

export class User {
   constructor(username, password) {
      this.username = username;
      this.password = password;
   }
}