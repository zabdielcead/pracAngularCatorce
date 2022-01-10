import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisCode } from '../../interfaces/paisesregion.interface';

import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {


  miFormulario: FormGroup  = this.fb.group({
    region:['', Validators.required],
    pais:['', Validators.required],
    frontera: [  {value:'', disabled: true} , Validators.required]
  })
  
  // llenar selectores 
  regiones: string[]=[];
  paises: PaisCode [] = [];
  fronteras: string[] = [];

  cargando:boolean = false;
  

  constructor(private fb:FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

  //   this.miFormulario.get('region')?.valueChanges.subscribe( region => {
  //     //console.log(region);
  //     this.paisesService.getPaisesPorRegion(region).subscribe(paises => {
  //       console.log(paises);
  //       this.paises = paises
  //     });
  //   });
  // }

      this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
              this.miFormulario.get('pais')?.reset('');
              this.miFormulario.get('frontera')?.disable();
              this.cargando = true;
          } ),
          switchMap(region => this.paisesService.getPaisesPorRegion(region))
        )
        .subscribe( paises => {

          console.log(paises);
          this.paises = paises;
          this.cargando = false;
        })



    // cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.miFormulario.get('frontera')?.enable();
        }),
        switchMap(codigo => {
          // const data = this.paisesService.getPaisPorCodigo(codigo);
          // console.log(data)
          return this.paisesService.getPaisPorCodigo(codigo);;
        })
      )
      .subscribe(pais => {
        console.log('paises' ,pais);
        if(pais !== null){
          this.fronteras = pais[0]?.borders || [] ;
        }
        
      })

  }


  guardar(){
    console.log(this.miFormulario.value);
  }

}
