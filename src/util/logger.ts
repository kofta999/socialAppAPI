import winston from "winston";

winston.format.combine(winston.format.colorize(), winston.format.json());

export default winston.createLogger({
  transports: [new winston.transports.Console()],
});
