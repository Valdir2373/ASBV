import { ClientEntitie } from "../../../domain/entities/ClientEntitie.js";
import { IClientRepository } from "../../../domain/repository/IClientRepository.js";
import { IClientInputDto } from "../dto/IClientInput.js";

export class SaveClient {
  constructor(private clientRepository: IClientRepository) {}
  async execute(clientInputDto: IClientInputDto): Promise<ClientEntitie> {
    const clientEntitie = new ClientEntitie(
      clientInputDto.id,
      clientInputDto.name
    );
    await this.clientRepository.saveClient(clientEntitie);
    return clientEntitie;
  }
}
