// IMachineRepository.ts
import { MachineEntitie } from "../entities/MachineEntitie.js";

export interface IMachineRepository {
  saveMachine(machineEntitie: MachineEntitie): Promise<MachineEntitie>;
  getMachineById(id: string): Promise<MachineEntitie | undefined>;
  getAllMachinesFromClientByKeyUser(keyUser: string): Promise<MachineEntitie[]>;
  delete(key: string, name: string): Promise<void>; // ← ADICIONE ESTA LINHA
}
