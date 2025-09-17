import { MachineEntitie } from "../../../domain/entities/MachineEntitie.js";
import { IMachineRepository } from "../../../domain/repository/IMachineRepository.js";
import { IMachineOutput } from "../dto/IMachineOutput.js";

export class GetMachinesByKeyUser {
  constructor(private machineRepository: IMachineRepository) {}
  async execute(keyUser: string): Promise<MachineEntitie[] | []> {
    const machinesEntities: MachineEntitie[] | undefined =
      await this.machineRepository.getAllMachinesFromClientByKeyUser(keyUser);
    return machinesEntities;
  }
}
