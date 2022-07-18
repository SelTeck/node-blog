import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}


export const config = {
    jwt: {

    },
    bcrypt: {

    },
    host: {

    },
    database: {
      host: required('MARIA_HOST'),
      port: required('MARIA_PORT'),
      user: required('MARIA_USER'),
      pw: required('MARIA_PW'),
      db: required('MARIA_DB')
      
    }
};
