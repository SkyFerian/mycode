import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LabelComponent } from '@codex-ui/label';
import { ButtonComponent } from '@codex-ui/button';
import { MySaleService } from '../../../services/saleapi.services';
import { MySales } from '@codex-ui/mysales';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FileService } from '../../../services/fileService';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { myToastService } from '@codex-ui/toastservice';
import { TOAST_STATE } from '@codex-ui/mytoast';

@Component({
  template: `
    '<iframe id="myframe" *ngIf="pdfSrc" [src]="pdfSrc"></iframe>'

    <form
      [formGroup]="addForm"
      #test="ngForm"
      id="addForm"
      (ngSubmit)="addfunction()"
    >
      <div class="addsale-container">
        <div class="addsale-class">
          <div>
            <p class="addtext">Aanmaken verkoopfactuur</p>
          </div>
          <div class="flex-container">
            <div>
              <codex-ui-label class="labels" for="facnr"
                >Factuur nummer</codex-ui-label
              >
              <input
                data-cy="facnrfield"
                class="fields"
                [formControlName]="'facnr'"
              />
              <div data-cy="facnrerror" class="error-message">
                {{ getErrorMessage('facnr') }}
              </div>
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="client"
                >Client</codex-ui-label
              >
              <input
                data-cy="clientfield"
                class="fields"
                formControlName="client"
                id="client"
              />
              <div data-cy="clienterror" class="error-message">
                {{ getErrorMessage('client') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="enterprisenumber"
                >Ondernemingsnummer</codex-ui-label
              >
              <input
                class="fields"
                formControlName="enterprisenumber"
                id="enterprisenumber"
              />
              <div class="error-message">
                {{ getErrorMessage('enterprisenumber') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="addressclient"
                >Adres klant
              </codex-ui-label>
              <input
                class="fields"
                formControlName="addressclient"
                id="addressclient"
              />
              <div class="error-message">
                {{ getErrorMessage('addressclient') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="postalclient"
                >Klant postcode
              </codex-ui-label>
              <input
                class="fields"
                formControlName="postalclient"
                id="postalclient"
              />
              <div class="error-message">
                {{ getErrorMessage('postalclient') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="city">Stad </codex-ui-label>
              <input class="fields" formControlName="city" id="city" />
              <div class="error-message">{{ getErrorMessage('city') }}</div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="land">Land </codex-ui-label>
              <input class="fields" formControlName="land" id="land" />
              <div class="error-message">{{ getErrorMessage('land') }}</div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="information"
                >Informatie</codex-ui-label
              >
              <input
                class="fields"
                formControlName="information"
                id="information"
              />
              <div class="error-message">
                {{ getErrorMessage('information') }}
              </div>

              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="description">
                Omschrijving</codex-ui-label
              >

              <input
                class="fields"
                formControlName="description"
                id="description"
              />

              <div class="error-message">
                {{ getErrorMessage('description') }}
              </div>
            </div>
            <div>
              <codex-ui-label class="labels" for="variety"
                >Hoeveelheid</codex-ui-label
              >
              <input class="fields" formControlName="variety" id="variety" />
              <div class="error-message">
                {{ getErrorMessage('variety') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="amount"
                >Bedrag</codex-ui-label
              >
              <input
                data-cy="amountfield"
                class="fields"
                formControlName="amount"
                id="amount"
              />
              <div data-cy="amounterror" class="error-message">
                {{ getErrorMessage('amount') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="discount"
                >Korting</codex-ui-label
              >
              <input class="fields" formControlName="discount" id="discount" />
              <div class="error-message">
                {{ getErrorMessage('discount') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="btwprocent"
                >BTW %</codex-ui-label
              >
              <input
                class="fields"
                formControlName="btwprocent"
                id="btwprocent"
              />
              <div class="error-message">
                {{ getErrorMessage('btwprocent') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="btw">BTW</codex-ui-label>
              <input class="fields" formControlName="btw" id="btw" />
              <div class="error-message">{{ getErrorMessage('btw') }}</div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="totalamount">
                Aantal</codex-ui-label
              >

              <input
                class="fields"
                formControlName="totalamount"
                value=""
                id="totalamount"
              />
              <div class="error-message">
                {{ getErrorMessage('totalamount') }}
              </div>
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="accountant"
                >Boekhouder</codex-ui-label
              >
              <select
                data-cy="acountantselect"
                (change)="valuechange()"
                class="fields"
                formControlName="accountant"
              >
                <option [ngValue]="null" disabled>accountant</option>
                <option
                  *ngFor="let accountant of selectaccountant"
                  [ngValue]="accountant.name"
                >
                  {{ accountant.name }}
                </option>
              </select>
              <div class="error-message">
                {{ getErrorMessage('accountant') }}
              </div>

              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="mystatus"
                >Status</codex-ui-label
              >
              <select
                data-cy="mystatus"
                (change)="valuechange()"
                class="fields"
                formControlName="mystatus"
              >
                <option [ngValue]="null" disabled>Select status</option>
                <option
                  *ngFor="let mystatus of allstatus"
                  [ngValue]="mystatus.name"
                >
                  {{ mystatus.name }}
                </option>
              </select>
              <div class="error-message">
                {{ getErrorMessage('mystatus') }}
              </div>
            </div>
          </div>
          <div>
            <codex-ui-button (click)="loadPdf()" class="mybutton" type="button"
              >PDF voorbeeld</codex-ui-button
            >

            <codex-ui-button class="mybutton" type="submit"
              >Toevoegen</codex-ui-button
            >
          </div>
        </div>
      </div>
    </form>
  `,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'codex-ui-addsale',
  imports: [
    CommonModule,
    LabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [MySaleService, DatePipe],
  standalone: true,
  styleUrls: ['./addsale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSaleComponent implements OnInit {
  factuurNummer: FormControl = new FormControl('', Validators.required);
  optelsom: string | undefined;
  pdfSrc: SafeResourceUrl | undefined;

  data: any;

  @ViewChild('pdfViewer', { static: false }) pdfViewer: any;

  @ViewChild('outsideElement', { static: true }) outsideElement:
    | ElementRef
    | undefined;
  @ViewChild('modalView', { static: true }) modalView$: ElementRef | undefined;

  pdfData: string | undefined;
  booldisable = true;
  checknumber: number | undefined;
  constructor(
    private toast: myToastService,
    public datepipe: DatePipe,
    private http: HttpClient,
    private fileservice: FileService,
    private sanitizer: DomSanitizer
  ) {
    this.checknumber = 0;
  }
  saved = true;
  pdfvieuwon = false;
  addForm: FormGroup = new FormGroup({
    facnr: new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
    ]),

    client: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    city: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    land: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    information: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),

    addressclient: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    postalclient: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[1-9]\\d{3}$'),
      Validators.min(1000),
      Validators.max(9999),
    ]),
    variety: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
    enterprisenumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}\.\d{3}\.\d{3}$/),
      Validators.min(0),
    ]),
    discount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,4})?$/),
      Validators.min(0),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,4})?$/),
      Validators.min(0),
    ]),
    btwprocent: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,4})?$/),
      Validators.min(0),
    ]),
    btw: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,4})?$/),
      Validators.min(0),
    ]),
    totalamount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,4})?$/),
      Validators.min(0),
    ]),
    accountant: new FormControl(null, [
      Validators.required,
      Validators.minLength(1),
    ]),
    mystatus: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
  });
  allstatus = [{ name: 'Active' }, { name: 'Processing' }, { name: 'Pending' }];
  selectaccountant = [{ name: 'Yes' }, { name: 'No' }];
  public currentInvoice!: MySales;
  private mySaleService: MySaleService = inject(MySaleService);
  private readonly router = inject(Router);

  addfunction() {
    this.data = this.generateData();
    console.log('generation here');
    console.log(this.data);

    this.mySaleService.getinvoices().subscribe((invoices: MySales[]) => {
      const existingIds = invoices.map((invoice) => invoice.id);
      const maxId = Math.max(...existingIds);
      const newId = maxId + 1;

      const toAddSales: MySales = {
        id: newId,
        facnr: this.addForm.get('facnr')?.value,
        statement: this.data.statement,
        description: this.addForm.get('description')?.value,
        amount: this.addForm.get('amount')?.value,
        btwprocent: this.addForm.get('btwprocent')?.value,
        btw: this.addForm.get('btw')?.value,
        city: this.addForm.get('city')?.value,
        totalamount: this.addForm.get('totalamount')?.value,
        mystatus: this.addForm.get('mystatus')?.value,
        variety: this.addForm.get('variety')?.value,
        duedate: this.data.duedate || '',
        information: this.addForm.get('information')?.value,
        client: this.addForm?.get('client')?.value,
        addressclient: this.addForm?.get('addressclient')?.value,
        postalclient: this.addForm?.get('postalclient')?.value,
        land: this.addForm?.get('land')?.value,
        enterprisenumber: this.addForm?.get('enterprisenumber')?.value,
        createdat: this.data.createdat || '',
        discount: this.data.myval,
        accountant: this.addForm?.get('accountant')?.value,
        lastupdated: this.data.createdat || '',
      };

      this.mySaleService.putinvoices(toAddSales).subscribe(() => {
        if (this.data.createdat && this.data.duedate && this.data.statement) {
          this.generatePdf();
        }
        this.toast.showToast(
          TOAST_STATE.success,
          'Toevoegen van: ' + this.addForm.get('facnr')?.value + ' is gelukt!'
        );
        this.router.navigate(['invoicing/sales']);
      }),
        (error: Error) => {
          console.error(error);
          this.toast.showToast(
            TOAST_STATE.danger,
            'Something went wrong trying to create'
          );
        };
    }),
      (error: Error) => {
        console.error(error);
        this.toast.showToast(
          TOAST_STATE.danger,
          'Something went wrong trying to fetch invoices'
        );
      };

    this.dismissError();
    this.saved = true;
  }

  private dismissError(): void {
    setTimeout(() => {
      this.toast.dismissToast();
    }, 2000);
  }

  public ngOnInit(): void {
    this.mySaleService.getinvoices().subscribe((sales: MySales) => {
      this.addForm.controls['totalamount'].disable();
      this.addForm.controls['btw'].disable();
      this.currentInvoice = sales;
      //binden van formulier
      this.addForm.reset({
        facnr: this.currentInvoice.facnr,
        information: this.currentInvoice.information,
        variety: this.currentInvoice.variety,
        city: this.currentInvoice.city,
        client: this.currentInvoice.client,
        addressclient: this.currentInvoice.addressclient,
        postalclient: this.currentInvoice.postalclient,
        land: this.currentInvoice.land,
        enterprisenumber: this.currentInvoice.enterprisenumber,
        statement: this.currentInvoice.statement,
        createdat: this.currentInvoice.createdat,
        description: this.currentInvoice.description,
        amount: this.currentInvoice.amount,
        discount: this.currentInvoice.discount,
        btwprocent: this.currentInvoice.btwprocent,
        btw: this.currentInvoice.btw,
        totalamount: this.currentInvoice.totalamount,
        accountant: this.currentInvoice.accountant,
        mystatus: this.currentInvoice.mystatus,
        lastupdated: this.currentInvoice.lastupdated, //binden omdat functie word geroepen vanuit angular niet van deze class
      });
    });

    combineLatest([
      //kijken of iets veranderd
      this.addForm.controls['variety']?.valueChanges,
      this.addForm.controls['amount']?.valueChanges,
      this.addForm.controls['btwprocent']?.valueChanges,
      this.addForm.controls['discount']?.valueChanges,
      //subscribe op de 3
    ]).subscribe(([variety, amount, btwProcent, discount]) => {
      if (variety != null && amount != null && btwProcent != null) {
        if (discount == null) {
          discount = 0;
        }

        const berekening = Number(variety * amount);
        const discountAmount = Number(berekening * (discount / 100));
        const baseAmount = Number(berekening - discountAmount);
        const btwAmount = baseAmount * (btwProcent / 100);

        const bedragInclusiefBtw = baseAmount + btwAmount;
        this.addForm.patchValue({
          btw: Number(btwAmount).toFixed(2),
          totalamount: Number(bedragInclusiefBtw).toFixed(2),
        });
      }
    });
  }

  //functies om te zorgen dat je niet perongeluk weg kan klikken nog niet af
  valuechange(): void {
    this.saved = false;
  }
  //zodat je niet perongeluk cancelt als je data hebt ingevoerd
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.saved) {
      return confirm('Do you want to discard the changes made?');
    }
    return true;
  }
  getErrorMessage(controlName: string) {
    const control = this.addForm.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return 'Dit veld is verplicht';
      }
      if (control.errors['pattern']) {
        if (controlName == 'variety') {
          return 'U moet hier een geheel getal invoeren';
        }
        if (
          controlName == 'totalamount' ||
          controlName == 'btw' ||
          controlName == 'discount' ||
          controlName == 'btwprocent' ||
          controlName == 'amount'
        ) {
          return 'U moet hier een geldig getal invoeren';
        }
        return 'Ongeldige invoer';
      }
      if (control.errors['maxlength']) {
        return `Maximale lengte is ${control.errors['maxlength'].requiredLength}`;
      }
      if (control.errors['minlength']) {
        return `Minimale lengte is ${control.errors['minlength'].requiredLength}`;
      }
      if (control.errors['min']) {
        return 'Het getal moet groter zijn dan 0';
      }
    }
    return '';
  }
  generateData(): any {
    if (this.checknumber == 0) {
      console.log('generator');
      const myDate = new Date();
      const formattedDate = this.datepipe.transform(myDate, 'yyyy-MM-dd');
      const nextDate = new Date(myDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const dbVervaldag = this.datepipe.transform(nextDate, 'yyyy-MM-dd');
      const randomNumber1 = Math.floor(Math.random() * 900) + 100;
      const randomNumber2 = Math.floor(Math.random() * 9000) + 1000;
      const randomNumber3 = Math.floor(Math.random() * 90000) + 10000;
      const mededeling =
        '+++' +
        randomNumber1.toString() +
        '/' +
        randomNumber2.toString() +
        '/' +
        randomNumber3.toString() +
        '+++';

      return {
        facnr: this.addForm.get('facnr')?.value,
        client: this.addForm.get('client')?.value,
        addressclient: this.addForm.get('addressclient')?.value,
        postalclient: this.addForm.get('postalclient')?.value,
        enterprisenumber: this.addForm.get('enterprisenumber')?.value,
        information: this.addForm.get('information')?.value,
        variety: this.addForm.get('variety')?.value,
        city: this.addForm.get('city')?.value,
        land: this.addForm.get('land')?.value,
        statement: mededeling,
        description: this.addForm.get('description')?.value,
        amount: this.addForm.get('amount')?.value,
        discount: this.addForm.get('discount')?.value,
        createdat: formattedDate,
        duedate: dbVervaldag,
        btwprocent: this.addForm.get('btwprocent')?.value,
        btw: this.addForm.get('btw')?.value,
        totalamount: this.addForm.get('totalamount')?.value,
      };
    }
    this.checknumber = 1;
  }

  public generatePdf() {
    this.data = this.generateData();
    console.log(this.data);
    this.fileservice.generatePdf(this.data).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
      },
      error: (error) =>
        this.toast.showToast(
          TOAST_STATE.danger,
          'Er is iets mis gegaan: ' + JSON.stringify(error)
        ),
    });
    this.dismissError();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    const outsideElement =
      this.outsideElement?.nativeElement.contains(targetElement);
    if (outsideElement) {
      this.modalView$?.nativeElement.classList.remove('visible');
    }
  }

  loadPdf() {
    this.data = this.generateData();
    this.fileservice.previewPDF(this.data).subscribe((blob: Blob) => {
      console.log('PDF Blob received:', blob);

      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);

      setTimeout(() => {
        this.pdfSrc = this.bypassAndSanitize(url);
        console.log('PDF URL:', url);
      }, 100);

      (error: Error) => {
        console.error('Error occurred while generating PDF:', error);
        this.toast.showToast(
          TOAST_STATE.danger,
          'Something went wrong trying to create'
        );
      };
    });
  }
  bypassAndSanitize(url: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
