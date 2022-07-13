import dayjs from 'dayjs/esm';
import { ICurrency } from 'src/app/entities/currency/currency.model';
import { ICreditFacility } from 'src/app/entities/credit-facility/credit-facility.model';
import { ILoanType } from 'src/app/entities/loan-type/loan-type.model';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface ILoan {
  id?: number;
  amount?: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs | null;
  interestRate?: number;
  interestAmount?: number;
  totalPaymentAmount?: number;
  remainingAmount?: number;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  currency?: ICurrency | null;
  facility?: ICreditFacility | null;
  loanType?: ILoanType | null;
}

export class Loan implements ILoan {
  constructor(
    public id?: number,
    public amount?: number,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs | null,
    public interestRate?: number,
    public interestAmount?: number,
    public totalPaymentAmount?: number,
    public remainingAmount?: number,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public currency?: ICurrency | null,
    public facility?: ICreditFacility | null,
    public loanType?: ILoanType | null
  ) {}
}

export function getLoanIdentifier(loan: ILoan): number | undefined {
  return loan.id;
}
