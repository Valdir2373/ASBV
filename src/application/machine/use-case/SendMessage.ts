import { IMachineRepository } from "../../../domain/repository/IMachineRepository.js";

export class SendMessageToMachineById {
  constructor(private machineRepository: IMachineRepository) {}
  async execute(id: string, message: string) {
    const machine = await this.machineRepository.getMachineById(id);
    if (machine) {
      machine.ws.send(message);
      return machine;
    }
    console.log("machine not found");
  }
}
