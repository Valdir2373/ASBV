import { ClientEntitie } from "../entities/ClientEntitie.js";

export interface IClientRepository {
  saveClient(clientEntitie: ClientEntitie): Promise<ClientEntitie>;
  getClientById(id: string): Promise<ClientEntitie | undefined>;
  getAllClientsFromUserByIdUser(idUser: string): Promise<ClientEntitie[]>;
}
