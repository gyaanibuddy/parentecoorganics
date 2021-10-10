import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
message = { body: '', type: '' };

  constructor() { }

  ngOnInit(): void {
  }
  setMessage(body, type, time = 3000): void {
    this.message.body = body;
    this.message.type = type;
    setTimeout(() => this.message.body = '', time);
  }
}
