import { IMiddlewareHandler } from "./IMiddlewareHandler.js";
import { HttpMethods } from "../../server/interfaces/IServerHttp.js";

export interface IMiddlewareManagerRoutes {
  registerRouter(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void;
  registerFileUploadRouter(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void;
  registerRouterToClient(
    methodHTTP: HttpMethods,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): void;
}
