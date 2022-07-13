import dayjs from 'dayjs/esm';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface ILoanPayment {
  id?: number;
  amount?: number;
  paymentDate?: dayjs.Dayjs | null;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
}

export class LoanPayment implements ILoanPayment {
  constructor(
    public id?: number,
    public amount?: number,
    public paymentDate?: dayjs.Dayjs | null,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null
  ) {}
}

export function getLoanPaymentIdentifier(loanPayment: ILoanPayment): number | undefined {
  return loanPayment.id;
}
