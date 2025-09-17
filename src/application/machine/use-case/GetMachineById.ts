import { MachineEntitie } from "../../../domain/entities/MachineEntitie.js";
import { IMachineRepository } from "../../../domain/repository/IMachineRepository.js";

export class GetMachineById {
  constructor(private machineRepository: IMachineRepository) {}
  async execute(idMachine: string): Promise<MachineEntitie | undefined> {
    const machine = this.machineRepository.getMachineById(idMachine);
    if (machine) return machine;
    console.log(idMachine + " id machine not found ");
    return;
  }
}
