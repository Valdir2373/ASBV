import { WebSocket, WebSocketServer } from "ws";
import { IMessage, IServerWs, IWS } from "../interfaces/IServerWs.js";
import { error } from "console";
import { Server } from "http";

class WsAdapter implements IWS {
  constructor(private ws: WebSocket) {}
  on(
    event: "message" | "close" | "error",
    listener: (...args: any[]) => void
  ): void {
    this.ws.on(event, listener);
  }
  send(data: string): void {
    this.ws.send(data);
  }
}

export class ServerWsAdapter implements IServerWs {
  private wss: WebSocketServer | null = null;
  private eventHandlers: Map<
    string,
    (ws: IWS, data: IMessage) => void | Promise<void>
  >;

  constructor() {
    this.eventHandlers = new Map();
  }

  registerEvent<T extends IMessage>(
    eventName: string,
    handler: (ws: IWS, data: T) => void | Promise<void>
  ): void {
    console.log(`✅ Rota WebSocket registrada: ${eventName}`);
    this.eventHandlers.set(
      eventName,
      handler as (ws: IWS, data: IMessage) => void | Promise<void>
    );
  }

  on(event: "connection", listener: (ws: IWS) => void): void {
    if (event !== "connection") {
      console.warn(
        `O método on() no ServerWsAdapter só suporta o evento 'connection'. Evento '${event}' ignorado.`
      );
      return;
    }

    if (!this.wss) {
      throw new Error(
        "O servidor WebSocket ainda não foi inicializado. Chame o método 'listen' primeiro."
      );
    }

    this.wss.on("connection", (rawWs) => {
      const ws = new WsAdapter(rawWs);
      ws.on("message", async (message: string) => {
        try {
          const data = JSON.parse(message);
          const handler = this.eventHandlers.get(data.message);
          if (handler) {
            await handler(ws, data);
          } else {
            ws.send(
              JSON.stringify({ error: `Evento desconhecido: ${data.message}` })
            );
          }
        } catch (e) {
          error(e);
          ws.send(JSON.stringify({ error: "Mensagem inválida." }));
        }
      });
      listener(ws);
    });
  }

  listen(server: Server): void {
    if (this.wss) {
      console.warn(
        "Servidor WebSocket já inicializado. Ignorando a inicialização."
      );
      return;
    }
    this.wss = new WebSocketServer({ server });
  }
}
