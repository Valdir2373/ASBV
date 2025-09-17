import { Server } from "http";
import { IDataAccess } from "../../domain/repository/IDataAccess.js";
import { InMemoryDataAccess } from "../database/memory/DataAccess.js";
import { ClientModules } from "../modules/ClientModule.js";
import { MachinesModule } from "../modules/MachinesModule.js";
import { ExpressAdapter } from "../server/implementation/ExpressAdapter.js";
import { ServerWsAdapter } from "../server/implementation/ServerWsAdapter.js";
import { IServerHttp } from "../server/interfaces/IServerHttp.js";
import { IServerWs } from "../server/interfaces/IServerWs.js";
import { MiddlewareAdapter } from "../middleware/implementation/MiddlewareAdapter.js";
import { IMiddlewareManagerRoutes } from "../middleware/interfaces/IMiddlewareManagerRoutes.js";

export class AppModule {
  private serverWs: IServerWs;
  private serverHttp: IServerHttp;
  private middleWare: IMiddlewareManagerRoutes;
  private dataAcess: IDataAccess;
  constructor() {
    this.serverHttp = new ExpressAdapter();
    this.middleWare = new MiddlewareAdapter(this.serverHttp);
    this.serverWs = new ServerWsAdapter();
    this.dataAcess = new InMemoryDataAccess();
    this.Modules();
  }

  private Modules() {
    new MachinesModule(this.serverWs, this.dataAcess);
    new ClientModules(this.middleWare, this.dataAcess);
  }

  listen(port: number) {
    const serverListen: Server = this.serverHttp.listen(port);
    this.serverWs.listen(serverListen);
    this.serverWs.on("connection", (ws) => {
      console.log("Nova conexão estabelecida.");
    });
    // ViewsAvailableToInjectUnused()
  }
}
