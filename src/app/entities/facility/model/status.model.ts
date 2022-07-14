export interface IStatus {
  id?: number;
  code?: string;
  label?: string;
}

export class Status implements IStatus {
  constructor(public id?: number, public code?: string, public label?: string) {}
}

export function getStatusIdentifier(status: IStatus): number | undefined {
  return status.id;
}
