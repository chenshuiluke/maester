import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Output() onEditorKeyup = new EventEmitter<any>();

  editor;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var quill = new Quill('#editor', {
      theme: 'snow'
    });
    quill.on('text-change', this.handleTextChange);
  }

  ngOnDestroy() {
  }

  handleTextChange(delta, old, source){
    console.log(`delta: ${JSON.stringify(delta)}`);
    console.log(`old: ${JSON.stringify(old)}`);
  }
}
