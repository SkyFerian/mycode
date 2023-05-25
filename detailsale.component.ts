/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FileService } from '../../../services/fileService';

import { myToastService } from '@codex-ui/toastservice';
import { TOAST_STATE } from '@codex-ui/mytoast';
import { LabelComponent } from '@codex-ui/label';
import { ButtonComponent } from '@codex-ui/button';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MySaleService } from '@codex-ui/sales';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MySales } from '@codex-ui/mysales';
@Component({
  template: ` <form [formGroup]="detailForm" #test="ngForm">
      <div class="detailsale-container">
        <div class="detailsale-class">
          <div>
            <p class="addtext">Details van verkoopfactuur</p>
          </div>
          <div class="flex-container">
            <div>
              <codex-ui-label class="labels" for="facnr"
                >Factuur nummer</codex-ui-label
              >
              <input class="fields" [formControlName]="'facnr'" />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="client"
                >Client</codex-ui-label
              >
              <input class="fields" formControlName="client" id="client" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="enterprisenumber"
                >Ondernemingsnummer</codex-ui-label
              >
              <input
                class="fields"
                formControlName="enterprisenumber"
                id="enterprisenumber"
              />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="addressclient"
                >Adres klant
              </codex-ui-label>
              <input
                class="fields"
                formControlName="addressclient"
                id="addressclient"
              />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="postalclient"
                >Klant postcode
              </codex-ui-label>
              <input
                class="fields"
                formControlName="postalclient"
                id="postalclient"
              />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="city">Stad </codex-ui-label>
              <input class="fields" formControlName="city" id="city" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="land">Land </codex-ui-label>
              <input class="fields" formControlName="land" id="land" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="information"
                >Informatie</codex-ui-label
              >
              <input
                class="fields"
                formControlName="information"
                id="information"
              />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="statement">
                Gestructureerde mededeling
              </codex-ui-label>
              <input
                class="fields"
                formControlName="statement"
                id="statement"
              />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="createdat">
                Aangemaakt op
              </codex-ui-label>
              <input
                type="date"
                class="fields"
                formControlName="createdat"
                id="createdat"
              />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="duedate">
                Vervaldag
              </codex-ui-label>
              <input
                type="date"
                class="fields"
                formControlName="duedate"
                id="duedate"
              />
            </div>
            <div>
              <codex-ui-label class="labels" for="description">
                Omschrijving</codex-ui-label
              >

              <input
                class="fields"
                formControlName="description"
                id="description"
              />

              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="variety"
                >Variëteit</codex-ui-label
              >
              <input class="fields" formControlName="variety" id="variety" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="amount"
                >Bedrag</codex-ui-label
              >
              <input class="fields" formControlName="amount" id="amount" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="discount"
                >Korting</codex-ui-label
              >
              <input class="fields" formControlName="discount" id="discount" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="btwprocent"
                >BTW %</codex-ui-label
              >
              <input
                class="fields"
                formControlName="btwprocent"
                id="btwprocent"
              />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="btw">BTW</codex-ui-label>
              <input class="fields" formControlName="btw" id="btw" />
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
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="accountant"
                >Boekhouder</codex-ui-label
              >
              <input
                class="fields"
                formControlName="accountant"
                id="accountant"
              />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="mystatus"
                >status</codex-ui-label
              >
              <input class="fields" formControlName="mystatus" id="mystatus" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="lastupdated">
                Laatst aangepast op
              </codex-ui-label>
              <input
                type="date"
                class="fields"
                formControlName="lastupdated"
                id="lastupdated"
              />
            </div>
          </div>

          <div>
            <codex-ui-button class="mybutton" (click)="update()">
              Bewerken</codex-ui-button
            >
            <codex-ui-button class="mybutton" (click)="downloadpdf()">
              DownloadPDF</codex-ui-button
            >
            <codex-ui-button
              class="mybutton"
              type="button"
              (click)="clickMethod()"
            >
              Verwijderen</codex-ui-button
            >
          </div>
        </div>
      </div>
    </form>
    <router-outlet></router-outlet>`,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'codex-ui-details',
  imports: [
    CommonModule,
    LabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [MySaleService],
  standalone: true,
  styleUrls: ['./detailsale.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailSaleComponent implements OnInit {
  id: number | undefined;
  mySales: MySales | undefined;

  constructor(
    private toast: myToastService,
    private route: ActivatedRoute,
    private saleService: MySaleService,
    private http: HttpClient,
    private fileservice: FileService
  ) {}

  private readonly router = inject(Router);
  detailForm: FormGroup = new FormGroup({
    facnr: new FormControl(null, [Validators.required]),

    city: new FormControl(null, [Validators.required]),
    variety: new FormControl(null, [Validators.required]),
    duedate: new FormControl(null, [Validators.required]),
    information: new FormControl(null, [Validators.required]),
    land: new FormControl(null, [Validators.required]),
    enterprisenumber: new FormControl(null, [Validators.required]),
    client: new FormControl(null, [Validators.required]),
    addressclient: new FormControl(null, [Validators.required]),
    postalclient: new FormControl(null, [Validators.required]),
    statement: new FormControl(null, [Validators.required]),
    createdat: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
    discount: new FormControl(null, [Validators.required]),
    btwprocent: new FormControl(null, [Validators.required]),
    btw: new FormControl(null, [Validators.required]),
    totalamount: new FormControl(null, [Validators.required]),
    accountant: new FormControl(null, [Validators.required]),
    mystatus: new FormControl(null, [Validators.required]),
    lastupdated: new FormControl(null, [Validators.required]),
  });
  private dismissError(): void {
    setTimeout(() => {
      this.toast.dismissToast();
    }, 2000);
  }
  public ngOnInit(): void {
    this.detailForm.controls['facnr'].disable();
    this.detailForm.controls['city'].disable();
    this.detailForm.controls['information'].disable();
    this.detailForm.controls['variety'].disable();
    this.detailForm.controls['duedate'].disable();
    this.detailForm.controls['client'].disable();
    this.detailForm.controls['addressclient'].disable();
    this.detailForm.controls['postalclient'].disable();
    this.detailForm.controls['enterprisenumber'].disable();
    this.detailForm.controls['land'].disable();
    this.detailForm.controls['statement'].disable();
    this.detailForm.controls['createdat'].disable();
    this.detailForm.controls['description'].disable();
    this.detailForm.controls['amount'].disable();
    this.detailForm.controls['discount'].disable();
    this.detailForm.controls['totalamount'].disable();
    this.detailForm.controls['btwprocent'].disable();
    this.detailForm.controls['btw'].disable();
    this.detailForm.controls['accountant'].disable();
    this.detailForm.controls['mystatus'].disable();
    this.detailForm.controls['lastupdated'].disable();
    this.route.queryParams.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.putvalue();
  }

  update() {
    this.router.navigate(['invoicing/updatesale/:'], {
      queryParams: { id: this.id },
    });
  }

  remove(): void {
    this.saleService.getinvoice(this.id!).subscribe((response: MySales) => {
      const filename = response.facnr + 'VF.pdf';
      this.fileservice.removePdf(filename).subscribe();
    });
    this.saleService.removeInvoice(this.id!).subscribe({
      next: () => {
        this.saleService.getinvoices().subscribe((response: Response) => {
          this.toast.showToast(
            TOAST_STATE.success,
            'Succesvol verwijderen van factuurnummer: ' +
              this.detailForm.get('facnr')?.value +
              '!'
          );
          this.router.navigate(['invoicing/sales']);
        });
      },
      error: (error) =>
        this.toast.showToast(
          TOAST_STATE.success,
          'Er is iets mis gegaan: ' + error
        ),
    });
    this.dismissError();
  }

  clickMethod() {
    if (confirm('Are you sure to delete ' + this.mySales?.facnr)) {
      this.remove();
    }
  }
  downloadpdf(): void {
    this.saleService.getinvoice(this.id!).subscribe((response: MySales) => {
      const filename = response.facnr;
      const finalname = filename + 'VF.pdf';
      this.fileservice.downloadPDF(finalname).subscribe((response) => {
        const suggestedFilename =
          this.extractFilenameFromContentDisposition(response);

        const filenameToDownload = suggestedFilename || finalname;

        const blob = new Blob([response.body || ''], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filenameToDownload;
        link.click();
        window.URL.revokeObjectURL(url);
      });
    });
  }

  private extractFilenameFromContentDisposition(
    response: HttpResponse<Blob>
  ): string | null {
    const contentDispositionHeader = response.headers.get(
      'content-disposition'
    );

    if (contentDispositionHeader) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const filenameMatch = contentDispositionHeader.match(filenameRegex);

      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, '');
      }
    }

    return null;
  }

  putvalue(): void {
    this.saleService.getinvoice(this.id!).subscribe((response: MySales) => {
      this.mySales = response;
      this.detailForm.setValue({
        facnr: this.mySales.facnr,
        information: this.mySales.information,
        variety: this.mySales.variety,
        city: this.mySales.city,
        duedate: this.mySales.duedate,
        client: this.mySales.client,
        addressclient: this.mySales.addressclient,
        postalclient: this.mySales.postalclient,
        enterprisenumber: this.mySales.enterprisenumber,
        land: this.mySales.land,
        statement: this.mySales.statement,
        createdat: this.mySales.createdat,
        description: this.mySales.description,
        amount: this.mySales.amount,
        discount: this.mySales.discount,
        btwprocent: this.mySales.btwprocent,
        btw: this.mySales.btw,
        totalamount: this.mySales.totalamount,
        accountant: this.mySales.accountant,
        mystatus: this.mySales.mystatus,
        lastupdated: this.mySales.lastupdated,
      });
    });
  }
}
