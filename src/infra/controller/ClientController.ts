import { IMiddlewareManagerRoutes } from "../middleware/interfaces/IMiddlewareManagerRoutes.js";
import { MachinesService } from "../services/MachinesService.js";

export class ClientController {
  constructor(
    private serviceMachines: MachinesService,
    private server: IMiddlewareManagerRoutes
  ) {
    this.mountRoutes();
  }
  async mountRoutes() {
    this.server.registerRouterToClient("get", "/machines", async (req, res) => {
      const { key } = req.headers;
      const machines = await this.serviceMachines.getMachinesOfUserByKey(key);

      res.json(machines);
    });
    this.server.registerRouter("post", "/message", this.sendMessage.bind(this));
    this.server.registerRouter(
      "get",
      "/clear-machines",
      this.clearMachinesOfUser.bind(this)
    );
  }
  async clearMachinesOfUser(req: any, res: any) {
    const { key } = req.headers;
    if (!key) return res.send("<h1>UNAUTHORIZED</h1>");
    await this.serviceMachines.clearMachinesByKeyUser(key);
    res.send("machines cleaned");
  }

  async sendMessage(req: any, res: any) {
    const { message, key, name } = req.body;

    let parsedMessage = message;
    if (typeof message === "string") {
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        return res.status(400).send("message inválida");
      }
    }

    if (req.file) {
      console.log(
        "Áudio recebido:",
        req.file.originalname,
        req.file.size,
        "bytes"
      );
    }

    const result = await this.serviceMachines.sendMessage(
      key,
      parsedMessage,
      name
    );

    if (!result) {
      return res.status(404).send("não enviado");
    }

    res.send("enviado");
  }
}
