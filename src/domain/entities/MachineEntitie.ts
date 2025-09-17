import { IWS } from "../../infra/server/interfaces/IServerWs.js";
import { randomUUID } from "crypto";

export class MachineEntitie {
  constructor(
    public id: string,
    public keyUser: string,
    public name: string,
    public ws: IWS
  ) {}
  static generateMachine(keyUser: string, name: string, ws: IWS) {
    const id: string = randomUUID();
    const machine = new MachineEntitie(id, keyUser, name, ws);
    return machine;
  }
}
