import dayjs from 'dayjs/esm';
import { ILoanType } from '../model/loan-type.model';
import { IStatus } from '../model/status.model';
import { ICreditFacility } from '../model/credit-facility.model';

export interface ICreditFacilityLoanLimit {
  id?: number;
  code?: string;
  totalLimit?: number;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  loanType?: ILoanType | null;
  status?: IStatus | null;
  facilities?: ICreditFacility[] | null;
}

export class CreditFacilityLoanLimit implements ICreditFacilityLoanLimit {
  constructor(
    public id?: number,
    public code?: string,
    public totalLimit?: number,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public loanType?: ILoanType | null,
    public status?: IStatus | null,
    public facilities?: ICreditFacility[] | null
  ) {}
}

export function getCreditFacilityLoanLimitIdentifier(creditFacilityLoanLimit: ICreditFacilityLoanLimit): number | undefined {
  return creditFacilityLoanLimit.id;
}
