import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaisCode } from '../interfaces/paisesregion.interface';
import { RespPais } from '../interfaces/paiscode.interface';


@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseUrl: string = 'https://restcountries.com/v3.1/region/';

  get regiones() {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }


  getPaisesPorRegion(region: string): Observable<PaisCode[]>{

    const url: string = `${this._baseUrl}${region}?fields=cca3,name`;
    return this.http.get<PaisCode[]>(url);
  }


  getPaisPorCodigo(codigo: string): Observable<RespPais[] | null>{
      console.log('pais', codigo);
    if(!codigo){
      return of(null);
    }

      const url = `https://restcountries.com/v3.1/alpha?codes=${codigo}`;

      return this.http.get<RespPais[]>(url);
  }
}
