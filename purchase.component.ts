import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MyPurchaseApiService } from '../../../services/purchaseapi.services';
import { ButtonComponent } from '@codex-ui/button';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import {
  faBusinessTime,
  faSpinner,
  faCircleCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyPurchases } from '@codex-ui/purchasemodel';
@Component({
  template: `
    <h2 id="titel">Aankoopfacturen</h2>
    <codex-ui-button
      class="floatbutton"
      routerLinkActive="active"
      (click)="routingadd()"
      ><fa-icon [icon]="faPlus"></fa-icon
    ></codex-ui-button>

    <div class="header">
      <input
        type="text"
        class="search-input"
        placeholder="Search"
        [(ngModel)]="searchQuery"
        (keyup)="search(searchQuery)"
      />

      <div
        *ngIf="filteredDates && startDate && endDate"
        class="filtered-dates-container"
      >
        <p class="filtered-dates-text">
          Filtered dates: {{ startDate | date }} - {{ endDate | date }}
        </p>
      </div>

      <div class="date-selector-container">
        <codex-ui-button
          class="select-dates-button"
          *ngIf="selectdatebutton"
          (click)="toggleDateSelector()"
        >
          Select Dates
        </codex-ui-button>
        <div *ngIf="showDateSelector" class="date-picker-container">
          <label id="lbldatepick" for="startDatePicker"
            >Select a start date:</label
          >
          <input
            type="date"
            id="startDatePicker"
            class="date-picker"
            [(ngModel)]="startDate"
          />
          <label id="lbldatepick" for="endDatePicker"
            >Select an end date:</label
          >
          <input
            type="date"
            id="endDatePicker"
            class="date-picker"
            [(ngModel)]="endDate"
          />
          <codex-ui-button class="filter-button" (click)="filterByDate()"
            >Select</codex-ui-button
          >
        </div>
      </div>
      <codex-ui-button (click)="resetSorting()" class="reset-button"
        >Reset</codex-ui-button
      >
      <div class="dropdown">
        <codex-ui-button class="dropbtn">Filter</codex-ui-button>
        <div class="dropdown-content">
          <div class="filter-group">
            <h4>Status:</h4>
            <div class="sub-options">
              <div class="checkbox-option">
                <input
                  type="checkbox"
                  (change)="applyFilters()"
                  id="active"
                  [(ngModel)]="selectedStatus.active"
                />
                <label for="active">Active</label>
              </div>
              <div class="checkbox-option">
                <input
                  type="checkbox"
                  (change)="applyFilters()"
                  id="processing"
                  [(ngModel)]="selectedStatus.processing"
                />
                <label for="processing">Processing</label>
              </div>
              <div class="checkbox-option">
                <input
                  type="checkbox"
                  (change)="applyFilters()"
                  id="pending"
                  [(ngModel)]="selectedStatus.pending"
                />
                <label for="pending">Pending</label>
              </div>
            </div>
          </div>
          <div class="filter-group">
            <h4>Accountant:</h4>
            <div class="sub-options">
              <div class="checkbox-option">
                <input
                  (change)="applyFilters()"
                  type="checkbox"
                  id="yes"
                  [(ngModel)]="selectedAccountant.yes"
                />
                <label for="yes">Yes</label>
              </div>
              <div class="checkbox-option">
                <input
                  (change)="applyFilters()"
                  type="checkbox"
                  id="no"
                  [(ngModel)]="selectedAccountant.no"
                />
                <label for="no">No</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="purchase-container">
      <div class="spacescss"></div>
      <table class="tablefix" *ngIf="myPurchases$ | async as MyPurchases">
        <th (click)="sortTable('facnr')">{{ getHeaderText('facnr') }}</th>
        <th (click)="sortTable('createdat')">
          {{ getHeaderText('createdat') }}
        </th>

        <th (click)="sortTable('supplier')">{{ getHeaderText('supplier') }}</th>
        <th (click)="sortTable('totalamount')">
          {{ getHeaderText('totalamount') }}
        </th>

        <th (click)="sortTable('accountant')">
          {{ getHeaderText('accountant') }}
        </th>
        <th (click)="sortTable('status')">{{ getHeaderText('status') }}</th>

        <ng-container *ngFor="let item of MyPurchases">
          <tr class="mydata" (click)="detailpage(item.id)">
            <td>
              {{ item.facnr }}
            </td>
            <td>
              {{ item.createdat }}
            </td>

            <td>
              {{ item.supplier }}
            </td>
            <td>
              {{ item.totalamount }}
            </td>
            <td>
              {{ item.accountant }}
            </td>

            <td id="active" *ngIf="item.mystatus === 'Active'">
              <fa-icon [icon]="faCircleCheck"></fa-icon>
              {{ item.mystatus }}
            </td>
            <td id="processing" *ngIf="item.mystatus === 'Processing'">
              <fa-icon [icon]="faSpinner"></fa-icon>
              {{ item.mystatus }}
            </td>
            <td id="pending" *ngIf="item.mystatus === 'Pending'">
              <fa-icon [icon]="faBusinessTime"></fa-icon>
              {{ item.mystatus }}
            </td>
          </tr>
        </ng-container>
      </table>
    </div>
  `,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'codex-ui-purchase',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    RouterModule,
    FontAwesomeModule,
  ],
  providers: [MyPurchaseApiService],
  standalone: true,
  styleUrls: ['./purchase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseComponent {
  faCircleCheck = faCircleCheck;
  faSpinner = faSpinner;
  faBusinessTime = faBusinessTime;
  faPlus = faPlus;
  showDateSelector: boolean = false;
  selectdatebutton: boolean = true;
  filteredDates: boolean = false;
  startDate: string = '';
  endDate: string = '';
  searchQuery: string = '';
  sortField: string = '';
  sortOrder: number = 1;
  selectedStatus = {
    active: false,
    processing: false,
    pending: false,
  };
  selectedAccountant = {
    yes: false,
    no: false,
  };
  headers: { [key: string]: string } = {
    facnr: 'Factuur nummer',
    createdat: 'Aangemaakt op',
    duedate: 'Vervaldag',
    client: 'Klant naam',
    totalamount: 'Bedrag',
    accountant: 'Boekhouder',
    status: 'Status',
  };
  myPurchases$!: Observable<MyPurchases[]>;
  private myPurchaseService: MyPurchaseApiService =
    inject(MyPurchaseApiService);
  private readonly router = inject(Router);
  constructor(private route: ActivatedRoute) {
    this.myPurchases$ = this.myPurchaseService.getinvoices();
  }
  detailpage(currentID: number): void {
    this.router.navigate(['invoicing/detailpurchase/:'], {
      queryParams: { id: currentID },
    });
  }
  getall() {
    return this.myPurchaseService.getinvoices();
  }
  getHeaderText(name: string): string {
    const headerText = this.headers[name] || name;

    if (this.sortField === name) {
      return this.sortOrder === 1 ? `${headerText} ▲` : `${headerText} ▼`;
    } else {
      return headerText; // Standaardtekst
    }
  }
  toggleDateSelector() {
    this.showDateSelector = !this.showDateSelector;
    this.selectdatebutton = false;
    this.startDate = '';
    this.endDate = '';
    this.filteredDates = false;
  }
  sortTable(name: string) {
    if (this.sortField === name) {
      // Omgekeerde sortering als er voor een tweede keer op dezelfde naam wordt geklikt
      this.sortOrder = -this.sortOrder;
    } else {
      // Eerste klik op een nieuwe naam, reset de sorteerorde
      this.sortField = name;
      this.sortOrder = 1;
    }

    this.myPurchases$ = this.getall().pipe(
      map((data) => {
        return data.sort((a: any, b: any) => {
          const valueA = a[name];
          const valueB = b[name];

          if (!isNaN(valueA) && !isNaN(valueB)) {
            return (valueA - valueB) * this.sortOrder;
          } else if (valueA instanceof Date && valueB instanceof Date) {
            return (valueA.getTime() - valueB.getTime()) * this.sortOrder;
          } else if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueA.localeCompare(valueB) * this.sortOrder;
          } else {
            // Fallback - handle other types of data if needed
            return 0;
          }
        });
      })
    );
  }
  resetSorting(): void {
    this.startDate = '';
    this.endDate = '';
    this.searchQuery = '';
    this.sortField = '';
    this.sortOrder = 1;
    this.selectedStatus = {
      active: false,
      pending: false,
      processing: false,
    };
    this.selectedAccountant = {
      yes: false,
      no: false,
    };
    this.applyFilters();
    this.showDateSelector = false;
    this.selectdatebutton = true;
    this.filteredDates = false;
  }
  filterByDate(): void {
    this.myPurchases$ = this.getall().pipe(
      map((data: MyPurchases[]) => {
        const startDateTime = this.parseDateString(this.startDate);
        const endDateTime = this.parseDateString(this.endDate);
        if (!startDateTime || !endDateTime) {
          return data;
        }

        return data.filter((item: MyPurchases) => {
          const itemDateTime = this.parseDateString(item.createdat);
          if (itemDateTime !== null) {
            return itemDateTime >= startDateTime && itemDateTime <= endDateTime;
          } else {
            return false; // Exclude the item if itemDateTime is null
          }
        });
      }),

      debounceTime(300),
      distinctUntilChanged() // Only emit if the date inputs have changed
    );
    this.filteredDates = true;
    this.showDateSelector = false;
    this.selectdatebutton = true;
  }
  search(query: string): void {
    this.myPurchases$ = this.getall().pipe(
      map((data: MyPurchases[]) => {
        if (!query) {
          return data; // If the query is empty, return the original data
        }
        const normalizedQuery = query.toLowerCase();
        return data.filter((item: MyPurchases) => {
          // Customize this logic based on your search requirements
          // For example, you can search based on specific fields like item.facnr or item.client
          const searchFields: (keyof MyPurchases)[] = [
            'facnr',
            'createdat',
            'supplier',
            'totalamount',
            'accountant',
            'mystatus',
          ];
          return searchFields.some((field: keyof MyPurchases) => {
            const fieldValue = item[field];
            if (typeof fieldValue === 'string') {
              return fieldValue.toLowerCase().includes(normalizedQuery);
            } else if (typeof fieldValue === 'number') {
              return fieldValue.toString().includes(query);
            } else if (Array.isArray(fieldValue)) {
              // If the field value is an array, you can search based on its elements
              return (fieldValue as unknown as string[]).some(
                (element: string) => {
                  return element.includes(query);
                }
              );
            } else {
              return false;
            }
          });
        });
      }),
      debounceTime(300),
      distinctUntilChanged()
    );
  }
  applyFilters(): void {
    this.myPurchases$ = this.getall().pipe(
      map((data: MyPurchases[]) => {
        return data.filter((item: MyPurchases) => {
          // Apply the filters based on the selected options
          const statusFilter =
            (!this.selectedStatus.active &&
              !this.selectedStatus.pending &&
              !this.selectedStatus.processing) ||
            (this.selectedStatus.active && item.mystatus === 'Active') ||
            (this.selectedStatus.pending && item.mystatus === 'Pending') ||
            (this.selectedStatus.processing && item.mystatus === 'Processing');

          const accountantFilter =
            (!this.selectedAccountant.yes && !this.selectedAccountant.no) ||
            (this.selectedAccountant.yes && item.accountant === 'yes') ||
            (this.selectedAccountant.no && item.accountant === 'no');

          return statusFilter && accountantFilter;
        });
      })
    );
  }
  parseDateString(dateString: string): number | null {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.getTime();
  }
  routingadd() {
    this.router.navigate(['invoicing/purchase/add']);
  }
}
