const _ = require("lodash");
const path = require("path");
const camelize = require("camelize");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "database.db")
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "migrations")
    },
    seeds: {
      directory: path.join(__dirname, "seeds")
    },
    wrapIdentifier: (value, origImpl) => {
      if (value === "*") {
        return origImpl(value);
      }

      return origImpl(_.snakeCase(value));
    },
    postProcessResponse: (result) => {
      if (typeof result === "object") {
        return camelize(result);
      }

      if (!Array.isArray(result)) {
        return result;
      }

      if (result.length === 0 || !result[0] || typeof result[0] !== "object") {
        return result;
      }

      return camelize(result);
    }
  }
};
