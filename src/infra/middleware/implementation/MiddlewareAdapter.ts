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
}
