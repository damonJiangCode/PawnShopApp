export const createCityTable = `CREATE TABLE city (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100)
);`;
