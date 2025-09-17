export interface IHash {
  compare(pass: string): Promise<any>;
}
