import dayjs from 'dayjs/esm';
import { IStatus } from '../model/status.model';

export interface ILoanType {
  id?: number;
  code?: string | null;
  label?: string | null;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  status?: IStatus | null;
}

export class LoanType implements ILoanType {
  constructor(
    public id?: number,
    public code?: string | null,
    public label?: string | null,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public status?: IStatus | null
  ) {}
}

export function getLoanTypeIdentifier(loanType: ILoanType): number | undefined {
  return loanType.id;
}
