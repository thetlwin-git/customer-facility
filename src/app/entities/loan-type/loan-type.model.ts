import dayjs from 'dayjs/esm';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface ILoanType {
  id?: number;
  code?: string | null;
  label?: string | null;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
}

export class LoanType implements ILoanType {
  constructor(
    public id?: number,
    public code?: string | null,
    public label?: string | null,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null
  ) {}
}

export function getLoanTypeIdentifier(loanType: ILoanType): number | undefined {
  return loanType.id;
}
