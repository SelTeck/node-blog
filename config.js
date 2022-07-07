import dotenv from "dotenv";

export default class Config {
    constructor() {
        dotenv.config();
        this._config = {

        };
    }

    #required(key, defaultValue = undefined) {
        const value = process.env[key] || defaultValue;
        if (value == null) {
          throw new Error(`Key ${key} is undefined`);
        }
        return value;
      }
    
}