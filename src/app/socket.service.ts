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

    let observable = Rx.Observable.create((obs:Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    let observer = {
      message: (data:Object) => {
        console.log(data);
        this.emitter.emit(data);
      },
      next: (data: Object) => {
        ws.send(data);
      },
      error: (error: Object) => {
        console.log(error);
      },
      complete: () => {
        console.log("Socket closed");
      }
    };
    return Rx.Subject.create(observer, observable);
  }

  getEmitter(){
    return this.emitter;
  }

  send(message:any){
    this.socket.next(message);
  }

  getSocket(){
    return this.socket;
  }

}
