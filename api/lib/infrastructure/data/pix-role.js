const Bookshelf = require('../bookshelf');
const BookshelfUser = require('./user');
const BookshelfUserPixRole = require('./user-pix-role');

// id                 -   PK autoinc Integer
// user_id            -   Varchar  NULLABLE

module.exports = Bookshelf.model('PixRole', {

  tableName: 'pix_roles',

  user() {
    return this.belongsToMany(BookshelfUser).through(BookshelfUserPixRole);
  },

});
