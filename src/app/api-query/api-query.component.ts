import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from '@angular/router';
import { menuItems } from "../menuItems";

@Component({
  selector: 'app-api-query',
  templateUrl: './api-query.component.html',
  styleUrls: ['./api-query.component.css']
})
export class ApiQueryComponent implements OnInit {
  players
  menuItems = menuItems;
  description


  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) { console.log('const')}


  ngOnInit() {          
    const headers = { 'Access-Control-Allow-Origin': '*' }

    this.activeRoute.params.subscribe(routeParams => {
      var endpoint = this.router.url
      endpoint = endpoint.replace('/query/', '')
      var url = 'http://127.0.0.1:8081/api/v1.1/player/query?op=' + endpoint
  
      for (const prop in menuItems) {
        var item = menuItems[prop]
       if(item.op == endpoint){
         this.description = item.description
       }
       if(!this.description){ this.description = 'All players'; }
      }
  
      // Simple GET request with response type <any>
      this.http.get<any>(url, { headers }).subscribe(data => {
          this.players = data
          console.log(data)
      })
    })
  }

  deletePlayer(dbID){
    const headers = { 'Access-Control-Allow-Origin': '*' }
    var player

    var url = 'http://127.0.0.1:8081/api/v1.1/player/query?op=findOne&dbID=' + dbID

    // Simple GET request with response type <any>
    this.http.get<any>(url, { headers }).subscribe(data => {
        var postParms = 'firstName='+data.firstName
        postParms += '&lastName='+data.lastName   
    
        var url = 'http://127.0.0.1:8081/api/v1.1/player/delete?' + postParms

        // Simple DELETE request with response type <any>
        this.http.delete<any>(url, { headers }).subscribe(data => {
          this.router.navigateByUrl('/query/')
        })
    })

  }

}
