import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  constructor() { }

  addToCart(cartItem: CartItem){
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem : CartItem = undefined;

    if(this.cartItems.length > 0){

    //find item in cart based on id
    existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === cartItem.id);

    //check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);

    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    
    let totalPriceValue: number = 0;
    let totalQuatityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuatityValue += currentCartItem.quantity;
    }

    //publish the new values ... all subscribers will recieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuatityValue);

    //log data for debugging purposes
    this.logCartData(totalPriceValue, totalQuatityValue);
  }

  logCartData(totalPriceValue: number, totalQuatityValue: number) {
    console.log('Contents of the cart.')

    for(let tempCartItem of this.cartItems){
      const subCartTotal = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, price=${tempCartItem.unitPrice}, subtotal=${subCartTotal}`);
    }

    console.log(`total price: ${totalPriceValue.toFixed(2)}, total quantity: ${totalQuatityValue}`);
    console.log(`-----------------`);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    this.computeCartTotals();
  }

  remove(theCartItem: CartItem) {
    //Get index of item in array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id );

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
    }
    this.computeCartTotals();
  }

}
