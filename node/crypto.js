const crypto = require('crypto');
const secret = 'chihiro-kaneki';
const encodeCrypto = str => {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};
const decodeCrypto = str => {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
module.exports = { encodeCrypto, decodeCrypto };
