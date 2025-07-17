import dotenv from "dotenv";
// when inside seeders
// dotenv.config({path: "../../.env"});

dotenv.config();
export const getEnv = (name, defaultValue) => {
    const value = process.env[name];


    return value !== undefined && value !== '' ? value : defaultValue;
};

export default getEnv;