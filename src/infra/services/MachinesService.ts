import { IMachineInputDto } from "../../application/machine/dto/IMachineInput.js";
import { IMachineMessage } from "../interfaces/IMachineMessage.js";
import { IWS } from "../server/interfaces/IServerWs.js";
import { SaveMachine } from "../../application/machine/use-case/SaveMachine.js";
import { IMachineRepository } from "../../domain/repository/IMachineRepository.js";
import { GetMachinesByKeyUser } from "../../application/machine/use-case/GetMachinesByKeyUser.js";
import { MachineEntitie } from "../../domain/entities/MachineEntitie.js";
import { IMachineOutput } from "../../application/machine/dto/IMachineOutput.js";
import { IMessageDto } from "./IMessageDto.js";

export class MachinesService {
  private saveMachine: SaveMachine;
  private getMachinesByKeyUser: GetMachinesByKeyUser;
  constructor(private machineRepository: IMachineRepository) {
    this.saveMachine = new SaveMachine(this.machineRepository);
    this.getMachinesByKeyUser = new GetMachinesByKeyUser(
      this.machineRepository
    );
  }

  async handleMaquinaMessage(ws: IWS, data: IMachineMessage) {
    const machineInputDto: IMachineInputDto = {
      key: data.key,
      name: data.name,
      ws,
    };

    if (data.name && data.key) {
      console.log(machineInputDto);
      await this.saveMachine.execute(machineInputDto);
      ws.send(
        JSON.stringify({ message: "Sua maquina está esperando usuario" })
      );

      console.log(`Máquina conectada e registrada: ${data.name}`);
    } else {
      console.error("Mensagem de máquina inválida.");
      ws.send(JSON.stringify({ error: "Dados de máquina incompletos." }));
    }
  }

  async getMachinesOfUserByKey(key: string) {
    const machinesEntities = await this.getMachinesByKeyUser.execute(key);
    if (machinesEntities) {
      const machinesOutput: IMachineOutput[] = machinesEntities.map(
        (machine) => {
          return {
            id: machine.id,
            keyUser: machine.keyUser,
            name: machine.name,
          };
        }
      );
      return machinesOutput;
    } else {
      return [];
    }
  }

  async getMachineByKeyAndName(
    key: string,
    name: string
  ): Promise<MachineEntitie | undefined> {
    const machines = await this.getMachinesByKeyUser.execute(key);
    if (!machines) return;
    for (const machine of machines) {
      if (machine.name === name) return machine;
    }
    return;
  }

  async sendMessage(key: string, message: IMessageDto, name: string) {
    const machine = await this.getMachineByKeyAndName(key, name);
    if (!machine) return;

    machine.ws.send(JSON.stringify(message));
    return "success";
  }
}
