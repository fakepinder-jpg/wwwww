const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// genere une cle aleatoire en base64
function genKey() {
  return crypto.randomBytes(16).toString('base64');
}

const envPath = path.join(__dirname, '.env');
const examplePath = path.join(__dirname, '.env.example');

// verifie si le .env existe deja
if (fs.existsSync(envPath)) {
  console.log('.env existe deja, rien ne sera ecrase.');
  process.exit(0);
}

// verifie que le .env.example est present
if (!fs.existsSync(examplePath)) {
  console.error('.env.example introuvable !');
  process.exit(1);
}

// APP_KEYS necessite 4 cles separees par des virgules
const appKeys = [genKey(), genKey(), genKey(), genKey()].join(',');

// remplace les valeurs placeholder par des vraies cles
let content = fs.readFileSync(examplePath, 'utf8');
content = content.replace('cle1,cle2,cle3,cle4', appKeys);
content = content.replace('ton_salt_ici', genKey());
content = content.replace('ton_secret_admin_ici', genKey());
content = content.replace('ton_transfer_salt_ici', genKey());
content = content.replace('ta_cle_encryption_ici', genKey());
content = content.replace('ton_jwt_secret_ici', genKey());

fs.writeFileSync(envPath, content);
console.log('.env cree avec succes avec des cles generees automatiquement !');
