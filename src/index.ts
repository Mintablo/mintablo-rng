import server from "./server";
import { logger } from "./util";

const { NODE_ENV, PORT } = process.env;
const port = PORT || 5000;

server.listen(port, function () {
  logger.info(`mintablo-rng service is running on http://localhost:${port} in ${NODE_ENV} mode`);
});
