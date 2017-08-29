import {AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SocketService} from "../socket.service";

declare var $;
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
      console.log(`Received ${data}`);

      if(this.quill.getLength() > 1){
        this.quill.updateContents(JSON.parse(data).delta);
      }
      else{
        this.quill.setContents(JSON.parse(data).full_content);
      }


    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Quill.prototype.getHtml = function() {
      return this.container.querySelector('.ql-editor').innerHTML;
    };
    Quill.prototype.focus = function() {
      $('.ql-editor').focus();
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
      // var newOps = []
      // if(delta.ops){
      //   for(var counter = 0; counter < delta.ops.length; counter++){
      //     var op = delta.ops[counter];
      //     if(!op.insert){
      //       newOps.push(op);
      //     }
      //     else{
      //       op.insert = op.insert.replace(/\s+$/,"");
      //       console.log("replacing");
      //       newOps.push(op);
      //     }
      //   }
      // }
      //
      // delta.ops = newOps;
      //
      // let newDelta:any = old.concat(delta);
      var message = {
        delta: delta,
        full_content: this.quill.getContents()
      }
      this.socketService.send(JSON.stringify(message));
    }
    else{
      this.quill.focus();
      console.log("Focusing");
    }
  }
}
