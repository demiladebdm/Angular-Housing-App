import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IPropertyBase } from '../model/ipropertybase';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  constructor(private http: HttpClient) { }

  getProperty(id: number) {
    return this.getAllProperties().pipe(
      map(propertiesArray => {
        // throw new Error('New error')
        return propertiesArray.find(p => p.Id === id);
      })
    );
  }

  getAllProperties(SellRent?: number): Observable<Property[]> {
    return this.http.get('data/properties.json').pipe(
      map(data => {
        const propertiesArray: Array<Property> = [];
        const localProperties = JSON.parse(localStorage.getItem('newProperty'))

        if(localProperties) {
          for (const key in localProperties) {
            if(SellRent) {
              if(localProperties.hasOwnProperty(key) && localProperties[key].SellRent === SellRent) {
                propertiesArray.push(localProperties[key]);
              }
            } else {
              propertiesArray.push(localProperties[key]);
            }
          }
        }

        for (const id in data) {
          if(SellRent) {
            if(data.hasOwnProperty(id) && data[id].SellRent === SellRent) {
              propertiesArray.push(data[id]);
            }
          } else {
            propertiesArray.push(data[id]);
          }
        }

        return propertiesArray;
      })
    )

    return this.http.get<Property[]>('data/properties.json')
  }

  addProperty(property: Property) {
    let newProperty = [property];

    // Add new property in array if newProp already exists in the local storage
    if(localStorage.getItem('newProperty')) {
      newProperty = [property, ...JSON.parse(localStorage.getItem('newProperty'))];
    }

    localStorage.setItem('newProperty', JSON.stringify(newProperty))
  }

  newPropID() {
    if(localStorage.getItem('PID')) {
      localStorage.setItem('PID', String(+localStorage.getItem('PID') + 1));
      return +localStorage.getItem('PID');
    } else {
      localStorage.setItem('PID', '101');
      return 101;
    }
  }

}
