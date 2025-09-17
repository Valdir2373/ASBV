import { IDataAccess } from "../../domain/repository/IDataAccess.js";
import { ClientController } from "../controller/ClientController.js";
import { GetClassToGlobal } from "../global/GlobalModules.js";
import { IMiddlewareManagerRoutes } from "../middleware/interfaces/IMiddlewareManagerRoutes.js";
import { MachinesService } from "../services/MachinesService.js";

export class ClientModules {
  private machineService: MachinesService = GetClassToGlobal("MachinesService");

  constructor(
    private server: IMiddlewareManagerRoutes,
    private dataAccess: IDataAccess
  ) {
    new ClientController(this.machineService, this.server);
  }
}
