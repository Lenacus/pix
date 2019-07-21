const Bookshelf = require('../bookshelf');
const BookshelfUser = require('./user');
const BookshelfPixRole = require('./pix-role');

// id                 -   PK autoinc Integer
// user_id            -   FK ON users.id       NULLABLE
// pix_role_id        -   FK ON pix-roles.id   NULLABLE

module.exports = Bookshelf.model('UserPixRole', {

  tableName: 'users_pix_roles',

  user() {
    return this.belongsTo(BookshelfUser);
  },

  pixRole() {
    return this.belongsTo(BookshelfPixRole);
  }

});
