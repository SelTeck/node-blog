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
      host: required('DATABASE_HOST'),
      user: required('DATABASE_USER'),
      pw: required('DATABASE_PW')
      
    }
};
