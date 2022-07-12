import dayjs from 'dayjs/esm';
import { ILoanType } from 'src/app/entities/loan-type/loan-type.model';
import { Status } from 'src/app/entities/enumerations/status.model';

export interface ICreditFacilityLoanLimit {
  id?: number;
  totalLimit?: number;
  status?: Status;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  loanType?: ILoanType | null;
}

export class CreditFacilityLoanLimit implements ICreditFacilityLoanLimit {
  constructor(
    public id?: number,
    public totalLimit?: number,
    public status?: Status,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public loanType?: ILoanType | null
  ) {}
}

export function getCreditFacilityLoanLimitIdentifier(creditFacilityLoanLimit: ICreditFacilityLoanLimit): number | undefined {
  return creditFacilityLoanLimit.id;
}
