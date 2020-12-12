import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-api-form',
  templateUrl: './api-form.component.html',
  styleUrls: ['./api-form.component.css']
})
export class ApiFormComponent implements OnInit {
  apiForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    dbID: [''],
    passing: [''],
    rushing: [''],
    catches: [''],
    fg: [''],
    sacks: ['']
  })
  

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(){
    //Get ID
    var endpoint = this.router.url
    var dbID = endpoint.replace('/form/', '')
    //If ID, set values
    if(dbID){ this.formSetValues(dbID) }
  }

  formSetValues(dbID){
    var url = 'http://127.0.0.1:8081/api/v1.1/player/query?op=findOne&dbID=' + dbID
    this.http.get<any>(url).subscribe(data => {
      if(data){
        //console.log(data); console.log(this.apiForm.controls)
        this.apiForm.controls['firstName'].setValue(data.firstName)
        this.apiForm.controls['lastName'].setValue(data.lastName)
        this.apiForm.controls['dbID'].setValue(data._id)
        this.apiForm.controls['passing'].setValue(data.passTDs)
        this.apiForm.controls['rushing'].setValue(data.rushingYards)
        this.apiForm.controls['catches'].setValue(data.catchesMade)
        this.apiForm.controls['fg'].setValue(data.missedFG)
        this.apiForm.controls['sacks'].setValue(data.sacks)
      }
    })    
  }

  onSubmit() {
    const headers = { 'Access-Control-Allow-Origin': '*', responseType: 'text' }
    var postParms 
    var endpoint
    var bodyJson

    endpoint = this.apiForm.value.dbID ? 'update?' : 'add?'
    
    postParms = 'firstName='+this.apiForm.value.firstName
    postParms += '&lastName='+this.apiForm.value.lastName
    if(this.apiForm.value.passing){ postParms += '&passTDs='+this.apiForm.value.passing }
    if(this.apiForm.value.rushing){ postParms += '&rushingYards='+this.apiForm.value.rushing }
    if(this.apiForm.value.catches){ postParms += '&catchesMade='+this.apiForm.value.catches }
    if(this.apiForm.value.fg){ postParms += '&missedFG='+this.apiForm.value.fg }
    if(this.apiForm.value.sacks){ postParms += '&sacks='+this.apiForm.value.sacks }

    bodyJson = { firstName: this.apiForm.value.firstName, lastName: this.apiForm.value.lastName, passTDs: this.apiForm.value.passing }
    bodyJson = postParms

    var url = 'http://127.0.0.1:8081/api/v1.1/player/' + endpoint + postParms

    // Simple POST request with response type <any>
    this.http.post<any>(url, bodyJson,  { headers }).subscribe(data => { 
      this.router.navigateByUrl('/')
    })
  }
}
