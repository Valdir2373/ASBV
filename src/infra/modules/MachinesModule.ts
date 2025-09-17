import { IDataAccess } from "../../domain/repository/IDataAccess.js";
import { MachinesController } from "../controller/MachinesController.js";
import { SetClassToGlobal } from "../global/GlobalModules.js";
import { MachineRepository } from "../repository/MachineRepository.js";
import { IServerWs } from "../server/interfaces/IServerWs.js";
import { MachinesService } from "../services/MachinesService.js";

export class MachinesModule {
  constructor(private server: IServerWs, private dataAccess: IDataAccess) {
    const repository = new MachineRepository(this.dataAccess);
    const service = new MachinesService(repository);
    SetClassToGlobal("MachinesService", service);
    new MachinesController(this.server, service);
  }
}
