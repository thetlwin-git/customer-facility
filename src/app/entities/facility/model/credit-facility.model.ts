import dayjs from 'dayjs/esm';
import { IApplicant } from '../model/applicant.model';
import { ICurrency } from '../model/currency.model';
import { IStatus } from '../model/status.model';
import { ICreditFacilityLoanLimit } from '../model/credit-facility-loan-limit.model';

export interface ICreditFacility {
  id?: number;
  code?: string;
  totalLimit?: number;
  availableLimit?: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs | null;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  applicant?: IApplicant | null;
  currency?: ICurrency | null;
  status?: IStatus | null;
  loanLimits?: ICreditFacilityLoanLimit[] | null;
}

export class CreditFacility implements ICreditFacility {
  constructor(
    public id?: number,
    public code?: string,
    public totalLimit?: number,
    public availableLimit?: number,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs | null,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public applicant?: IApplicant | null,
    public currency?: ICurrency | null,
    public status?: IStatus | null,
    public loanLimits?: ICreditFacilityLoanLimit[] | null
  ) {}
}

export function getCreditFacilityIdentifier(creditFacility: ICreditFacility): number | undefined {
  return creditFacility.id;
}
