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

  getProductListPaginate(thePage: number, thePageSize:number, currentCategoryId:number ) : Observable<GetResponseProducts>{
    //build url
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
                    
    console.log(searchUrl);

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(currentCategoryId: number) : Observable<Product[]>{
    //build url
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

    return this.getProducts(searchUrl)
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize:number, theKeyword: string) : Observable<GetResponseProducts>{
    //build url based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
                    
    console.log(searchUrl);

    return this.httpClient.get<GetResponseProducts>(searchUrl);
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

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductsCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}
