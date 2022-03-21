import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Love2ShopFormService {

  private countriesUrl = 'http://localhost:8080/countries';
  
  private stateUrl = 'http://localhost:8080/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth:number) : Observable<number[]>{
    let data: number[] = [];

    //build array for month dropdown list
    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
        data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{

    let data: number[]=[];

    //build array for year dropdown list
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }

  getCountries() : Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string) : Observable<State[]>{

  const searchStateUrl = `http://localhost:8080/states/search/findByCountryCode?code=${countryCode}`;

  return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
    map(response => response._embedded.states)
  );

  }

}

interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
}
interface GetResponseStates{

  _embedded:{
    states : State[];
  }
}
