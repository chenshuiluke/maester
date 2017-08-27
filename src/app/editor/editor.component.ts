import {AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';

let quillGlobal:any;

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Output() onEditorKeyup = new EventEmitter<any>();
  quill:any;
  editor;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Quill.prototype.getHtml = function() {
      return this.container.querySelector('.ql-editor').innerHTML;
    };
    quillGlobal = new Quill('#editor', {
      theme: 'snow'
    });
    quillGlobal.on('text-change', this.handleTextChange);
  }

  ngOnDestroy() {
  }

  handleTextChange(delta, old, source){
    console.log(`delta: ${JSON.stringify(delta)}`);
    console.log(`old: ${JSON.stringify(old)}`);
    console.log(`source: ${JSON.stringify(source)}`);
    console.log(`content: ${quillGlobal.getHtml()}`);
    let newDelta:any = old.concat(delta);
    console.log(`new: ${JSON.stringify(newDelta)}`);

  }
}
