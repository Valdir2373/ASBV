import { MachineEntitie } from "../../domain/entities/MachineEntitie.js";
import { IDataAccess } from "../../domain/repository/IDataAccess.js";
import { IMachineRepository } from "../../domain/repository/IMachineRepository.js";

export class MachineRepository implements IMachineRepository {
  private readonly collectionName = "machines";

  constructor(private dataAccess: IDataAccess) {}

  async saveMachine(machineEntitie: MachineEntitie): Promise<MachineEntitie> {
    const newMachine = new MachineEntitie(
      machineEntitie.id,
      machineEntitie.keyUser,
      machineEntitie.name,
      machineEntitie.ws
    );
    const insertedId = await this.dataAccess.create<MachineEntitie>(
      this.collectionName,
      newMachine
    );

    if (insertedId === undefined) {
      throw new Error("Falha ao salvar a máquina.");
    }

    // A operação 'create' retorna o ID, que é utilizado para retornar a entidade completa.
    return { ...machineEntitie, id: insertedId.toString() };
  }

  async getMachineById(id: string): Promise<MachineEntitie | undefined> {
    const machine = await this.dataAccess.findOne<MachineEntitie>(
      this.collectionName,
      { id } as Partial<MachineEntitie>
    );

    return machine;
  }

  async getAllMachinesFromClientByKeyUser(
    keyUser: string
  ): Promise<MachineEntitie[]> {
    const machines = await this.dataAccess.findMany<MachineEntitie>(
      this.collectionName,
      { keyUser } as Partial<MachineEntitie>
    );

    return machines;
  }
}
