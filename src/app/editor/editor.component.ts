import {AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SocketService} from "../socket.service";


@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Output() onEditorKeyup = new EventEmitter<any>();
  quill:any;
  constructor(@Inject(SocketService) private socketService) {
    this.socketService.getEmitter().subscribe((data)=>{
      console.log(`Received ${JSON.stringify(data)}`);
      this.quill.setContents(data);
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Quill.prototype.getHtml = function() {
      return this.container.querySelector('.ql-editor').innerHTML;
    };
    this.quill = new Quill('#editor', {
      theme: 'snow'
    });
    this.quill.on('text-change', (delta, old, source)=> {
      this.handleTextChange(delta,old,source);
    });
  }

  ngOnDestroy() {
  }

  handleTextChange(delta, old, source){
    if(source == "user"){
      console.log(`delta: ${JSON.stringify(delta)}`);
      console.log(`old: ${JSON.stringify(old)}`);
      console.log(`source: ${JSON.stringify(source)}`);
      console.log(`content: ${this.quill.getHtml()}`);
      let newDelta:any = old.concat(delta);
      console.log(`new: ${JSON.stringify(newDelta)}`);
      this.socketService.send(this.quill.getContents());
    }
    else{
      this.quill.focus();
      console.log("Focusing");
    }
  }
}
