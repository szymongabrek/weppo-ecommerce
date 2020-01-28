const bcrypt = require('bcrypt-nodejs');

exports.encryptPassword = (password) =>{
  const saltRounds = 10;
  return new Promise( (resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) return reject(err);
          bcrypt.hash(password, salt, null, (err, hash) => {
              if (err) return reject(err);
              return resolve(hash);
          });
      });
  });
}

exports.verifyPassword = (password, hash) => {
  return new Promise( (resolve, reject) => {
      bcrypt.compare(password, hash, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
      });
  });
}
