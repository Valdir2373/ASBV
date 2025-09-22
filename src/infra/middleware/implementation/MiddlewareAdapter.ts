import {
  HttpMethods,
  IServerHttp,
} from "../../server/interfaces/IServerHttp.js";
import { IMiddlewareManagerRoutes } from "../interfaces/IMiddlewareManagerRoutes.js";
import { IMiddlewareHandler } from "../interfaces/IMiddlewareHandler.js";

export class MiddlewareAdapter implements IMiddlewareManagerRoutes {
  private isProduction = process.env.NODE_ENV === "production";

  constructor(private server: IServerHttp) {}

  registerRouterToClient(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void {
    this.registerRouter(methodHTTP, path, ...handlers);
  }

  registerRouter(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void {
    this.server.registerRouter(methodHTTP, path, ...handlers);
  }

  registerFileUploadRouter(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void {
    this.server.registerFileUploadRouter(methodHTTP, path, ...handlers);
  }

  // ✅ NOVO MÉTODO: Registra rota de upload de áudio com middleware correto
  registerAudioUploadRoute(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void {
    // Assume que o servidor tem o middleware de áudio configurado
    // Ex: this.server.multerAudioMiddleware
    if (!(this.server as any).multerAudioMiddleware) {
      throw new Error(
        "Servidor não possui middleware 'multerAudioMiddleware'. Configure-o primeiro."
      );
    }

    this.server.registerFileUploadRouter(
      methodHTTP,
      path,
      (this.server as any).multerAudioMiddleware, // 👈 Aplica middleware de áudio
      ...handlers // 👈 Seus handlers (ex: sendMessage)
    );
  }
}
