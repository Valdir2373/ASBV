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
    this.server.registerRouterToClient(
      "post",
      "/message",
      this.sendMessage.bind(this)
    );
  }
  async sendMessage(req: any, res: any) {
    const { message, key, name } = req.body;
    const sendMessageToMachine = await this.serviceMachines.sendMessage(
      key,
      message,
      name
    );
    if (!sendMessageToMachine) return res.send("não enviado");

    // if (machine) machine.ws.send(message);
    // else return res.send({ message: "erro: maquina not found" });

    res.send("enviado");
  }
}
