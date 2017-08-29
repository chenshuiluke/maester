import {EventEmitter, Inject, Injectable} from '@angular/core';
import * as Rx from 'rxjs';

@Injectable()
export class SocketService {
  socket:any;
  emitter:EventEmitter<any> = new EventEmitter();
  constructor(@Inject('SOCKET_HOST') private socket_host) {
    console.log(this.socket_host);
    this.socket = this.connect(this.socket_host);
  }

  public connect(url:string){
    if(!this.socket){
      this.socket = this.create(url);
      console.log(`Connected to ${url}`);
    }
    return this.socket;
  }

  create(url:string){
    let ws = new WebSocket(url);

    ws.onmessage = (message)=>{
      console.log(message.data);
      this.emitter.emit(message.data);
    };

    ws.onerror = (error) => {
      console.log(error);
    }

    ws.onclose = () => {
      console.log("Socket closed");
    }
    return ws;
  }

  getEmitter(){
    return this.emitter;
  }

  send(message:any){
    this.socket.send(message);
  }

  getSocket(){
    return this.socket;
  }

}
