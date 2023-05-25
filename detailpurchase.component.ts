/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { myToastService } from '@codex-ui/toastservice';
import { TOAST_STATE } from '@codex-ui/mytoast';
import { LabelComponent } from '@codex-ui/label';
import { ButtonComponent } from '@codex-ui/button';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MyPurchaseApiService } from '@codex-ui/purchase';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MyPurchases } from '@codex-ui/purchasemodel';
@Component({
  template: ` <form [formGroup]="detailForm" #test="ngForm">
      <div class="detailpurchase-container">
        <div class="detailpurchase-class">
          <div>
            <p class="addtext">Details</p>
          </div>
          <div class="flex-container">
            <div>
              <codex-ui-label class="labels" for="facnr"
                >Factuur nummer</codex-ui-label
              >
              <input class="fields" [formControlName]="'facnr'" />
              <div class="spacescss"></div>
              <codex-ui-label class="labels" for="supplier"
                >Leverancier</codex-ui-label
              >
              <input class="fields" [formControlName]="'supplier'" />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="supplieraddress"
                >Leverancier adres</codex-ui-label
              >
              <input class="fields" [formControlName]="'supplieraddress'" />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="postalsupplier"
                >Leverancier postcode</codex-ui-label
              >
              <input class="fields" [formControlName]="'postalsupplier'" />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="name"
                >Naam klant</codex-ui-label
              >
              <input class="fields" [formControlName]="'name'" />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="address"
                >Adres Klant</codex-ui-label
              >
              <input class="fields" [formControlName]="'address'" />
              <div class="spacescss"></div>

              <codex-ui-label class="labels" for="postal"
                >Postcode Klant</codex-ui-label
              >
              <input class="fields" [formControlName]="'postal'" />
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
              <codex-ui-label class="labels" for="description">
                Omschrijving</codex-ui-label
              >

              <input
                class="fields"
                formControlName="description"
                id="description"
              />
            </div>
            <div>
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
              update</codex-ui-button
            >

            <codex-ui-button
              class="mybutton"
              type="button"
              (click)="clickMethod()"
            >
              remove</codex-ui-button
            >
          </div>
        </div>
      </div>
    </form>
    <router-outlet></router-outlet>`,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'codex-ui-detailpurchase',
  imports: [
    CommonModule,
    LabelComponent,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [MyPurchaseApiService],
  standalone: true,
  styleUrls: ['./detailpurchase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPurchaseComponent implements OnInit {
  id: number | undefined;
  myPurchases: MyPurchases | undefined;

  constructor(
    private toast: myToastService,
    private route: ActivatedRoute,
    private myPurchaseApiService: MyPurchaseApiService
  ) {}

  private readonly router = inject(Router);
  detailForm: FormGroup = new FormGroup({
    facnr: new FormControl(null, [Validators.required]),
    supplier: new FormControl(null, [Validators.required]),
    supplieraddress: new FormControl(null, [Validators.required]),
    postalsupplier: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    postal: new FormControl(null, [Validators.required]),
    statement: new FormControl(null, [Validators.required]),
    createdat: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
    discount: new FormControl(null, [Validators.required]),
    btwprocent: new FormControl(null, [Validators.required]),
    btw: new FormControl(null, [Validators.required]),
    totalamount: new FormControl(null, [Validators.required]),
    accountant: new FormControl(null, [Validators.required]),
    lastupdated: new FormControl(null, [Validators.required]),
    mystatus: new FormControl(null, [Validators.required]),
  });
  private dismissError(): void {
    setTimeout(() => {
      this.toast.dismissToast();
    }, 2000);
  }
  public ngOnInit(): void {
    this.detailForm.controls['facnr'].disable();
    this.detailForm.controls['supplier'].disable();
    this.detailForm.controls['supplieraddress'].disable();
    this.detailForm.controls['postalsupplier'].disable();
    this.detailForm.controls['name'].disable();
    this.detailForm.controls['address'].disable();
    this.detailForm.controls['postal'].disable();
    this.detailForm.controls['statement'].disable();
    this.detailForm.controls['createdat'].disable();
    this.detailForm.controls['description'].disable();
    this.detailForm.controls['amount'].disable();
    this.detailForm.controls['discount'].disable();
    this.detailForm.controls['btwprocent'].disable();
    this.detailForm.controls['btw'].disable();
    this.detailForm.controls['totalamount'].disable();
    this.detailForm.controls['accountant'].disable();
    this.detailForm.controls['lastupdated'].disable();
    this.detailForm.controls['mystatus'].disable();
    this.route.queryParams.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.putvalue();
  }

  update() {
    this.router.navigate(['invoicing/updatepurchase/:'], {
      queryParams: { id: this.id },
    });
  }

  remove(): void {
    this.myPurchaseApiService.removeInvoice(this.id!).subscribe({
      next: () => {
        this.toast.showToast(
          TOAST_STATE.success,
          'Succesvol verwijderen van factuurnummer: ' +
            this.detailForm.get('facnr')?.value +
            '!'
        );
        this.myPurchaseApiService.getinvoices();
      },
      error: (error) =>
        this.toast.showToast(
          TOAST_STATE.success,
          'Er is iets mis gegaan: ' + error
        ),
    });
    this.dismissError();
    this.myPurchaseApiService.getinvoices().subscribe(() => {
      this.router.navigate(['invoicing/purchase']);
    });
  }

  //this.router.navigate(['invoicing/sales']);

  clickMethod() {
    if (confirm('Are you sure to delete ' + this.myPurchases?.facnr)) {
      this.remove();
    }
  }

  putvalue(): void {
    this.myPurchaseApiService
      .getinvoice(this.id!)
      .subscribe((response: MyPurchases) => {
        this.myPurchases = response;
        console.log(JSON.stringify(this.myPurchases));
        this.detailForm.setValue({
          facnr: this.myPurchases.facnr,
          supplier: this.myPurchases.supplier,
          supplieraddress: this.myPurchases.supplieraddress,
          postalsupplier: this.myPurchases.postalsupplier,
          name: this.myPurchases.name,
          address: this.myPurchases.address,
          postal: this.myPurchases.postal,
          statement: this.myPurchases.statement,
          createdat: this.myPurchases.createdat,
          description: this.myPurchases.description,
          amount: this.myPurchases.amount,
          discount: this.myPurchases.discount,
          btwprocent: this.myPurchases.btwprocent,
          btw: this.myPurchases.btw,
          totalamount: this.myPurchases.totalamount,
          accountant: this.myPurchases.accountant,
          mystatus: this.myPurchases.mystatus,
          lastupdated: this.myPurchases.lastupdated,
        });
      });
  }
}
