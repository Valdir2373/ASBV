import { IWS } from "../../../infra/server/interfaces/IServerWs.js";

export interface IMachineInputDto {
  key: string;
  name: string;
  ws: IWS;
}
