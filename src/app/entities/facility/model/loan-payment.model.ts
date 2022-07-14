import dayjs from 'dayjs/esm';
import { ILoan } from '../model/loan.model';
import { IStatus } from '../model/status.model';

export interface ILoanPayment {
  id?: number;
  amount?: number;
  paymentDate?: dayjs.Dayjs | null;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  loan?: ILoan | null;
  status?: IStatus | null;
}

export class LoanPayment implements ILoanPayment {
  constructor(
    public id?: number,
    public amount?: number,
    public paymentDate?: dayjs.Dayjs | null,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public loan?: ILoan | null,
    public status?: IStatus | null
  ) {}
}

export function getLoanPaymentIdentifier(loanPayment: ILoanPayment): number | undefined {
  return loanPayment.id;
}
