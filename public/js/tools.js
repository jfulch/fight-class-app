

    function getClassesAttended(allClasses, className){
    var numClassesAttended = 0;
    for (var i = 0; i < allClasses.length; i++) {
      if (allClasses[i].className == className) {
        numClassesAttended = numClassesAttended + 1
      }else{
        numClassesAttend = 0;
      }
    }
  
    return numClassesAttended;
  }

  //Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

  //Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}


module.exports.getClassesAttended = getClassesAttended;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
