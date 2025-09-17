import { MachineEntitie } from "../../../domain/entities/MachineEntitie.js";
import { IMachineRepository } from "../../../domain/repository/IMachineRepository.js";
import { IMachineInputDto } from "../dto/IMachineInput.js";

export class SaveMachine {
  constructor(private machineRepository: IMachineRepository) {}
  async execute(machineInputDto: IMachineInputDto): Promise<MachineEntitie> {
    const machineEntitie = MachineEntitie.generateMachine(
      machineInputDto.key,
      machineInputDto.name,
      machineInputDto.ws
    );
    await this.machineRepository.saveMachine(machineEntitie);
    return machineEntitie;
  }
}
