import { Logger } from "@nestjs/common";
import convict from "convict";
import * as yaml from "js-yaml";

import * as fs from "fs";

interface Config {
  env: string;
  server: {
    port: number;
    debugMode: boolean;
    logLevel: string;
  };
  frontend: {
    url: string;
  };
  db: {
    url: string;
  };
  auth: {
    jwtSecret: string;
  };
}

export const config = convict<Config>({
  env: {
    doc: "Specifies the environment of the running server.",
    format: ["production", "development", "stage"],
    default: "development",
    env: "APPLICATION_ENV",
  },
  server: {
    port: {
      doc: "The port to bind",
      format: "port",
      default: 8000,
      env: "PORT",
    },
    debugMode: {
      doc: "If this value is true, the logger is turned on.",
      format: Boolean,
      default: false,
      env: "DEBUG_MODE",
    },
    logLevel: {
      doc: "The severity of the logs",
      format: ["debug", "info", "warn", "error"],
      default: "info",
      env: "LOG_SEVERITY",
    },
  },
  frontend: {
    url: {
      doc: "The base url of the frontend app",
      format: "String",
      default: "http://localhost:3000",
      env: "FRONTEND_BASE_URL",
    },
  },
  db: {
    url: {
      doc: "The access url for mongodb",
      format: "String",
      default: "",
      env: "MONGO_DB_ACCESS_URL",
      sensitive: true,
    },
  },
  auth: {
    jwtSecret: {
      doc: "The secret used for signing JWT tokens",
      format: String,
      default: "agr4OTyYXhXiM12kzG8ifO6LXv6k8fo3",
      env: "JWT_SIGNING_SECRET",
      sensitive: true,
    },
  },
});

convict.addParser({ extension: ["yml", "yaml"], parse: yaml.load });

const envFilePath = "./.env.yml";
if (fs.existsSync(envFilePath)) {
  config.loadFile(envFilePath);
}

config.validate({ allowed: "strict" });

const logger = new Logger("Environment");
logger.log(`Successfully loaded environment: ${JSON.stringify(JSON.parse(config.toString()))}`);
