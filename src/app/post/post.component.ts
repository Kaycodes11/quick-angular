import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  DoCheck,
  Output,
  AfterContentInit,
  AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnChanges,OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input('img') postImg = "";
  @Output() imgSelected = new EventEmitter<string>();

  constructor() {
    console.log("constructor called", this.postImg);
  }

  ngOnChanges() {
    // it works when @Input() property's data set/resets
    console.log('ngOnChanges called', this.postImg);
  }

  ngOnInit() {
    console.log('ngOnInit called', this.postImg);
  }

  ngDoCheck () {
    console.log('DoCheck called', this.postImg)
  }

  ngAfterContentInit() {
    console.log('AfterContentInit', this.postImg);
  }

  ngAfterContentChecked() {
    console.log('AfterContentChecked', this.postImg)
  }
  ngAfterViewInit() {
    console.log('AfterViewInit', this.postImg);
  }
  ngAfterViewChecked() {
    console.log('AfterViewChecked', this.postImg);
  }
  ngOnDestroy() {
    console.log('onDestroy called ', this.postImg);
  }
}
