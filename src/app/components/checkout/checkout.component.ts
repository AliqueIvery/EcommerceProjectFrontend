import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/common/address';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Love2ShopFormService } from 'src/app/services/love2-shop-form.service';
import { Love2ShopValidators } from 'src/app/validators/love2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates:State[] = [];
  billingAddressStates: State[] = [];
  
  constructor(private formBuilder: FormBuilder, private cartService: CartService, private love2ShopService: Love2ShopFormService, private checkoutService:CheckoutService, private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails()
    
    this.checkoutFormGroup = new FormGroup({
      customer: new FormGroup({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Love2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth(); + 1;
    console.log('Start Month: '+startMonth);

    this.love2ShopService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log('Retrived Credit card months: '+ JSON.stringify(data));
        this.creditCardMonths = data;
    });

    //populate credit card years
    this.love2ShopService.getCreditCardYears().subscribe(
      data =>{
        console.log('Retrived cred card years: ' + JSON.stringify(data));
        this.creditCardYears = data;
    });

    this.love2ShopService.getCountries().subscribe(
      data =>{
        console.log('Retrieved countries: '+ JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  reviewCartDetails() {

    //subscribe to the cart total price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    //compute cart total
    this.cartService.computeCartTotals();
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName'); }

  get lastName(){return this.checkoutFormGroup.get('customer.lastName'); }

  get email(){return this.checkoutFormGroup.get('customer.email'); }


  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street'); }

  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state'); }

  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city'); }

  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country'); }

  get shippingAddressZipcode(){return this.checkoutFormGroup.get('shippingAddress.zipCode'); }


  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street'); }

  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state'); }

  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city'); }

  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country'); }

  get billingAddressZipcode(){return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  
  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType'); }

  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber'); }

  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode'); }

  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard'); }


  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

       //bug fix for state
       this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

       //bug fix for state
       this.billingAddressStates = [];
    }

  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;
    
    //create orderItems from cartItems
    let orderItems: OrderItem[] = [];

    for(let i = 0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    //setup purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address\
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state)); 
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country)); 
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state)); 
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country)); 
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call rest api from checkout service
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response =>{
          alert(`Your Order has been recieved. \nOrder Tracking number: ${response.orderTrackingNumber}`);

          //reset cart
          this.resetCart();
        },
        error: err=>{
          alert(`there was an error: ${err.message}`);
        }
      }
    );

    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form data
    this.checkoutFormGroup.reset();

    //navigate back to products page
    this.router.navigateByUrl('/products');
  }

  handleMonthAndYear(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear:number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if current year equals selected year, start with current month

    let startMonth:number;

    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() +1;
    }
    else{
      startMonth = 1;
    }

    this.love2ShopService.getCreditCardMonths(startMonth).subscribe(data =>{
      console.log('Retieve credit card Months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string){

      const formGroup = this.checkoutFormGroup.get(formGroupName);

      const countryCode = formGroup.value.country.code;
      const countryName = formGroup.value.country.name;

      this.love2ShopService.getStates(countryCode).subscribe(
        data => {
          if(formGroupName == 'shippingAddress'){
            this.shippingAddressStates = data;
          }else{
            this.billingAddressStates = data;
          }

          //Set default value
          formGroup.get('state').setValue(data[0]);
        }
      )
  }

  handleMonthsAndYears(){

  }
}
