import { IMachineInputDto } from "../../application/machine/dto/IMachineInput.js";
import { IMachineMessage } from "../interfaces/IMachineMessage.js";
import { IWS } from "../server/interfaces/IServerWs.js";
import { SaveMachine } from "../../application/machine/use-case/SaveMachine.js";
import { IMachineRepository } from "../../domain/repository/IMachineRepository.js";
import { GetMachinesByKeyUser } from "../../application/machine/use-case/GetMachinesByKeyUser.js";
import { MachineEntitie } from "../../domain/entities/MachineEntitie.js";
import { IMachineOutput } from "../../application/machine/dto/IMachineOutput.js";
import { IMessageDto } from "./IMessageDto.js";
import { IResponse } from "../middleware/interfaces/IResponse.js";

export class MachinesService {
  private saveMachine: SaveMachine;
  private getMachinesByKeyUser: GetMachinesByKeyUser;

  private queueResponseUse: { res: IResponse; key: string }[] = [];

  constructor(private machineRepository: IMachineRepository) {
    this.saveMachine = new SaveMachine(this.machineRepository);
    this.getMachinesByKeyUser = new GetMachinesByKeyUser(
      this.machineRepository
    );
  }

  async handleMaquinaMessage(ws: IWS, data: IMachineMessage) {
    const { key, name } = data;

    if (!name || !key) {
      console.error("Mensagem de máquina inválida.");
      ws.send(JSON.stringify({ error: "Dados de máquina incompletos." }));
      return;
    }

    const existingMachines =
      await this.machineRepository.getAllMachinesFromClientByKeyUser(key);
    const duplicate = existingMachines.find((m) => m.name === name);

    if (duplicate) {
      console.warn(
        `Máquina duplicada tentando conectar: ${name} (key: ${key})`
      );
      ws.send(
        JSON.stringify({ error: "Máquina com este nome já está registrada." })
      );
      ws.close?.(1008, "Duplicate machine");
      return;
    }

    const machineInputDto: IMachineInputDto = {
      key,
      name,
      ws,
    };

    console.log("Registrando máquina:", machineInputDto);
    await this.saveMachine.execute(machineInputDto);

    const onDisconnect = () => {
      console.log(`Máquina desconectada e removida: ${name} (key: ${key})`);
      this.machineRepository.delete(key, name).catch(console.error);
    };

    if ("onclose" in ws) {
      ws.onclose = onDisconnect;
    } else {
      ws.addEventListener?.("close", onDisconnect);
    }

    ws.send(JSON.stringify({ message: "Sua máquina está esperando usuario" }));
    console.log(`Máquina conectada e registrada: ${name}`);
  }

  async clearMachinesByKeyUser(key: string): Promise<void> {
    const machines =
      await this.machineRepository.getAllMachinesFromClientByKeyUser(key);

    const deletePromises = machines.map((machine) =>
      this.machineRepository.delete(key, machine.name)
    );

    await Promise.all(deletePromises);
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

  async sendMessage(
    key: string,
    message: IMessageDto,
    name: string,
    res?: IResponse
  ) {
    const machine = await this.getMachineByKeyAndName(key, name);
    if (!machine) return;
    machine.ws.send(JSON.stringify(message));
    if (!res) return "success";
    this.queueResponseUse.unshift({ res, key });
    return 1;
  }

  async sendMessageToUse(key: string, message: string) {
    let res = this.getRespondeOfUserByKey(key);
    res?.send(message);
  }

  getRespondeOfUserByKey(key: string): IResponse | undefined {
    let res;
    for (const queue of this.queueResponseUse) {
      if (queue.key === key) {
        res = queue.res;
        const index = this.queueResponseUse.indexOf(queue);
        this.queueResponseUse.splice(index, this.queueResponseUse.length);
      }
    }
    return res;
  }
}
