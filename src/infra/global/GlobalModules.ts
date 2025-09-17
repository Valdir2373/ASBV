class GlobalModules {
  private classGlobal = new Map<string, any>();
  setClassGlobal(className: string, classFunction: Object) {
    this.classGlobal.set(className, classFunction);
  }
  getClassGlobal(className: string) {
    return this.classGlobal.get(className);
  }
}

const globalModules = new GlobalModules();

export function SetClassToGlobal(className: string, classFunction: Object) {
  globalModules.setClassGlobal(className, classFunction);
}

export function GetClassToGlobal(className: string) {
  return globalModules.getClassGlobal(className);
}
