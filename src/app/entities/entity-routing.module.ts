import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'loan-type',
        data: { pageTitle: 'LoanTypes' },
        loadChildren: () => import('./loan-type/loan-type.module').then(m => m.LoanTypeModule),
      },
      {
        path: 'currency',
        data: { pageTitle: 'Currencies' },
        loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule),
      },
      // {
      //   path: 'loan',
      //   data: { pageTitle: 'Loans' },
      //   loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule),
      // },
      {
        path: 'applicant',
        data: { pageTitle: 'Applicants' },
        loadChildren: () => import('./applicant/applicant.module').then(m => m.ApplicantModule),
      },
      {
        path: 'credit-facility',
        data: { pageTitle: 'CreditFacilities' },
        loadChildren: () => import('./credit-facility/credit-facility.module').then(m => m.CreditFacilityModule),
      },
      {
        path: 'credit-facility-loan-limit',
        data: { pageTitle: 'CreditFacilityLoanLimits' },
        loadChildren: () =>
          import('./credit-facility-loan-limit/credit-facility-loan-limit.module').then(m => m.CreditFacilityLoanLimitModule),
      },
      // {
      //   path: 'loan-payment',
      //   data: { pageTitle: 'LoanPayments' },
      //   loadChildren: () => import('./loan-payment/loan-payment.module').then(m => m.LoanPaymentModule),
      // },
    ]),
  ],
})
export class EntityRoutingModule {}
