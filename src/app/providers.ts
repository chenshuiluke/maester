import { environment } from '../environments/environment';
import { SocketService } from "./socket.service";
export const constants:Array<any> = [
  {
    provide: 'SOCKET_HOST', useValue: environment.socket_host
  },
  {
    provide: SocketService, useClass:SocketService
  }
]
