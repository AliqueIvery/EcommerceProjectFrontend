import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/products';
  private categoryUrl = 'http://localhost:8080/product-category';

  constructor(private httpClient:HttpClient) { }

  getProductList(currentCategoryId: number) : Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

    return this.getProducts(searchUrl)
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() : Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductsCategory>("http://localhost:8080/product-category").pipe(
      map(response => response._embedded.productCategory)
    )
  }

  productSearch(theKeyword:string){
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  getProduct(productId: number): Observable<Product>{

    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts{
  _embedded:{
    products:Product[];
  }
}

interface GetResponseProductsCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}
