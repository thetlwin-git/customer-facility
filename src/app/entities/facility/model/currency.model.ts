import dayjs from 'dayjs/esm';
import { IStatus } from '../model/status.model';

export interface ICurrency {
  id?: number;
  code?: string;
  label?: string;
  editedBy?: string | null;
  editedOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdOn?: dayjs.Dayjs | null;
  status?: IStatus | null;
}

export class Currency implements ICurrency {
  constructor(
    public id?: number,
    public code?: string,
    public label?: string,
    public editedBy?: string | null,
    public editedOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public status?: IStatus | null
  ) {}
}

export function getCurrencyIdentifier(currency: ICurrency): number | undefined {
  return currency.id;
}
