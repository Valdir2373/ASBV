import { ClientEntitie } from "../../domain/entities/ClientEntitie.js";
import { IClientRepository } from "../../domain/repository/IClientRepository.js";
import { IDataAccess } from "../../domain/repository/IDataAccess.js";

export class ClientRepository implements IClientRepository {
  private readonly collectionName = "clients";

  constructor(private dataAccess: IDataAccess) {}

  async saveClient(clientEntitie: ClientEntitie): Promise<ClientEntitie> {
    const insertedId = await this.dataAccess.create<ClientEntitie>(
      this.collectionName,
      clientEntitie
    );

    if (insertedId === undefined) {
      throw new Error("Falha ao salvar o cliente.");
    }

    return { ...clientEntitie, id: insertedId.toString() };
  }

  async getClientById(id: string): Promise<ClientEntitie | undefined> {
    const client = await this.dataAccess.findOne<ClientEntitie>(
      this.collectionName,
      { id } as Partial<ClientEntitie>
    );

    return client;
  }

  async getAllClientsFromUserByIdUser(
    idUser: string
  ): Promise<ClientEntitie[]> {
    const clients = await this.dataAccess.findMany<ClientEntitie>(
      this.collectionName,
      { idUser } as Partial<ClientEntitie>
    );

    return clients;
  }
}
