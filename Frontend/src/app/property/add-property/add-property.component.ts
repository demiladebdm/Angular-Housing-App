import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IPropertyBase } from 'src/app/model/ipropertybase';
import { Property } from 'src/app/model/property';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-add-property',
  templateUrl: `add-property.component.html`,
  styleUrls: ['add-property.component.css']
})
export class AddPropertyComponent implements OnInit {
  // @ViewChild('Form') addPropertyForm: NgForm;
  @ViewChild('formTabs') formTabs?: TabsetComponent;

  addPropertyForm: FormGroup;
  nextClicked: boolean;

  property = new Property();

  propertyTypes: Array<string> = ['Villa', 'House', 'Apartment']
  furnishTypes: Array<string> = ['Fully', 'Semi', 'Unfurnished']

  propertyView: IPropertyBase = {
    Id: 0,
    SellRent: null,
    Name: '',
    PType: '',
    FType: null,
    Price: null,
    BHK: null,
    BuiltArea: null,
    City: null,
    RTM: null,
  };

 constructor(private router: Router, private fb: FormBuilder, private housingService: HousingService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createAddPropertyForm();
  }


  createAddPropertyForm(){
    this.addPropertyForm=this.fb.group({
      BasicInfo: this.fb.group({
        SellRent:['1', Validators.required],
        BHK:[null, Validators.required],
        PType:[null, Validators.required],
        FType:[null, Validators.required],
        Name:[null, [Validators.required, Validators.minLength(5)]],
        City:[null, Validators.required]
      }),
      PriceInfo: this.fb.group({
        Price:[null, Validators.required],
        BuiltArea:[null, Validators.required],
        CarpetArea:[null],
        Security:[null],
        Maintenance:[null]
      }),
      AddressInfo: this.fb.group({
        FloorNo:[null],
        TotalFloor:[null],
        Address:[null, Validators.required],
        Landmark:[null]
      }),
      OtherInfo: this.fb.group({
        RTM:[null, Validators.required],
        PossessionOn:[null],
        AOP:[null],
        Gated:[null],
        MainEntrance:[null],
        Description:[null]
      }),

    })
  }


  get getBasicInfo(){return this.addPropertyForm.controls['BasicInfo'] as FormGroup;}
  get getSellRent(){return this.getBasicInfo.controls['SellRent'] as FormControl;}
  get getBHK(){return this.getBasicInfo.controls['BHK'] as FormControl;}
  get getPType(){return this.getBasicInfo.controls['PType'] as FormControl;}
  get getFType(){return this.getBasicInfo.controls['FType'] as FormControl;}
  get getName(){return this.getBasicInfo.controls['Name'] as FormControl;}
  get getCity(){return this.getBasicInfo.controls['City'] as FormControl;}

  get getPriceInfo(){return this.addPropertyForm.controls['PriceInfo'] as FormGroup;}
  get getPrice(){return this.getPriceInfo.controls['Price'] as FormControl;}
  get getBuiltArea(){return this.getPriceInfo.controls['BuiltArea'] as FormControl;}
  get getCarpetArea(){return this.getPriceInfo.controls['CarpetArea'] as FormControl}
  get getSecurity(){return this.getPriceInfo.controls['Security'] as FormControl}
  get getMaintenance(){return this.getPriceInfo.controls['Maintenance'] as FormControl}


  get getAddressInfo(){return this.addPropertyForm.controls['AddressInfo'] as FormGroup;}
  get getFloorNo(){return this.getAddressInfo.controls['FloorNo'] as FormControl;}
  get getTotalFloor(){return this.getAddressInfo.controls['TotalFloor'] as FormControl;}
  get getAddress(){return this.getAddressInfo.controls['Address'] as FormControl;}
  get getLandmark(){return this.getAddressInfo.controls['Landmark'] as FormControl;}

  get getOtherInfo(){return this.addPropertyForm.controls['OtherInfo'] as FormGroup;}
  get getRTM(){return this.getOtherInfo.controls['RTM'] as FormControl;}
  get getPossessionOn(){return this.getOtherInfo.controls['PossessionOn'] as FormControl;}
  get getAOP(){return this.getOtherInfo.controls['AOP'] as FormControl;}
  get getGated(){return this.getOtherInfo.controls['Gated'] as FormControl;}
  get getMainEntrance(){return this.getOtherInfo.controls['MainEntrance'] as FormControl;}
  get getDescription(){return this.getOtherInfo.controls['Description'] as FormControl;}


  selectTab(nextTabId: number,isValid?:boolean) {
    this.nextClicked=true;
    if (isValid) {
      this.formTabs.tabs[nextTabId].active = true;
    }
  }

  onBack(){
      this.router.navigate(['/']);
  }

mapProperty(): void{
  this.property.Id = this.housingService.newPropID();
  this.property.SellRent = +this.getSellRent.value;
  this.property.BHK = this.getBHK.value;
  this.property.PType = this.getPType.value;
  this.property.Name = this.getName.value;
  this.property.City = this.getCity.value;
  this.property.FType = this.getFType.value;
  this.property.Price = this.getPrice.value;
  this.property.Security = this.getSecurity.value;
  this.property.Maintenance = this.getMainEntrance.value;
  this.property.BuiltArea = this.getBuiltArea.value;
  this.property.CarpetArea = this.getCarpetArea.value;
  this.property.FloorNo = this.getFloorNo.value;
  this.property.TotalFloor = this.getTotalFloor.value;
  this.property.Address = this.getAddress.value;
  this.property.Address2 = this.getLandmark.value;
  this.property.RTM = this.getRTM.value;
  this.property.AOP = this.getAOP.value;
  this.property.Gated = this.getGated.value;
  this.property.MainEntrance = this.getMainEntrance.value;
  this.property.Possession = this.getPossessionOn.value;
  this.property.Description = this.getDescription.value;
  this.property.PostedOn = new Date().toString();
}
  onSubmit(){
    this.nextClicked=true;
    if(this.allTabsValid()) {
      this.mapProperty();
      this.housingService.addProperty(this.property);
      this.alertify.success('Congratulations! Your property listed successfully on our website');
      console.log(this.addPropertyForm);

      if(this.getSellRent.value === '2') {
        this.router.navigate(['/rent-property']);
      } else {
        this.router.navigate(['/']);
      }

    } else {
      this.alertify.error('Please review the form and provide all valid entries');
    }
  }


  allTabsValid(): boolean {

    if(this.getBasicInfo.invalid){
        this.formTabs.tabs[0].active=true;
      return false;
    }
    if(this.getPriceInfo.invalid){
      this.formTabs.tabs[1].active=true;
      return false;
    }
   if(this.getAddressInfo.invalid){
    this.formTabs.tabs[2].active=true;
    return false;
    }
    if(this.getOtherInfo.invalid){
      this.formTabs.tabs[3].active=true;
      return false;
    }

    return true;
  }
}
