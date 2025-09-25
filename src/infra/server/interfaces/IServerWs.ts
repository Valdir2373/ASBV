import { Server } from "http";

export interface IMessage {
  message: string;
  [key: string]: any;
}

export interface IWS {
  addEventListener: any;
  close(code?: number, reason?: string): void; // ← ADICIONE ESTA LINHA
  on(event: "message", listener: (data: string) => void): void;
  on(event: "close", listener: (code: number, reason: string) => void): void;
  on(event: "error", listener: (err: Error) => void): void;
  send(data: string): void;
}

export interface IServerWs {
  on(event: "connection", listener: (ws: IWS) => void): void;
  listen(server: Server): void;

  registerEvent(
    eventName: string,
    handler: (ws: IWS, data: IMessage) => void | Promise<void>
  ): void;
}
