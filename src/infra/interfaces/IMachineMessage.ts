import { IMessage } from "../server/interfaces/IServerWs.js";

export interface IMachineMessage extends IMessage {
  key: string;
  name: string;
}

export interface IClientMessage extends IMessage {
  id: string;
  key: string;
}
