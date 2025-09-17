import { IMachineMessage } from "../interfaces/IMachineMessage.js";
import { IMessage, IServerWs, IWS } from "../server/interfaces/IServerWs.js";
import { MachinesService } from "../services/MachinesService.js";

export class MachinesController {
  constructor(
    private server: IServerWs,
    private machinesService: MachinesService
  ) {
    this.server.registerEvent(
      "sou maquina",
      async (ws: IWS, data: IMessage) => {
        const machineData = data as IMachineMessage;
        await this.machinesService.handleMaquinaMessage(ws, machineData);
      }
    );
  }
}
