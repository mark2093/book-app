import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public model:any = {};
  response: any;
  constructor(
    private _apiService:ApiService,
    private toastr: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  signin() {
    console.log("login.component.ts: sign() called");
    console.log("this.model",this.model);
    this._apiService.login(this.model).subscribe(
      data => {
        console.log("Successfull", data);
        this.response = data;
        console.log("Response: ", this.response.message);
        //check the response message
        if(this.response.message === "Login Successful") {
          console.log("login.component.ts: data: ", data);
          this.toastr.success(this.response["message"], "Success")
          localStorage.setItem('user_type', this.response.user_type);
          localStorage.setItem("token", this.response.token);
          this.router.navigate(['/books']);
        }
      },
      error => {
        this.toastr.error(error.error.message, "Error in login.component.ts");
        console.log("error.error.message",error.error.message)
      }
    )
  }

}
