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

  // ✅ Método corrigido: usa registerRawUploadRoute
  registerAudioUploadRoute(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void {
    if (!(this.server as any).multerAudioMiddleware) {
      throw new Error(
        "Servidor não possui middleware 'multerAudioMiddleware'. Configure-o primeiro."
      );
    }

    // ✅ Usa o novo método que aplica multer ANTES do wrap
    (this.server as any).registerRawUploadRoute(
      methodHTTP,
      path,
      (this.server as any).multerAudioMiddleware,
      ...handlers.map((handler) => (req: any, res: any, next: any) => {
        // Converte para assinatura esperada pelo wrapHandlerRaw
        return handler(req, res, next);
      })
    );
  }
}
