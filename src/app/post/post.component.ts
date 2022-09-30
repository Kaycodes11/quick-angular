import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  DoCheck,
  Output,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input('img') postImg = '';
  @Output() imgSelected = new EventEmitter<string>();

  constructor() {
    console.log('constructor called', this.postImg);
  }

  ngOnChanges() {
    // it works when @Input() property's data set/resets
    console.log(
      'ngOnChanges called only when input values has changed',
      this.postImg
    );
  }

  ngOnInit() {
    console.log('ngOnInit called on mount', this.postImg);
  }

  ngDoCheck() {
    console.log(
      'DoCheck called during every change detection run',
      this.postImg
    );
  }

  ngAfterContentInit() {
    console.log(
      'called when ng-content has been projected into view',
      this.postImg
    );
  }

  ngAfterContentChecked() {
    console.log(
      'called whenever projected content has been checked',
      this.postImg
    );
  }
  ngAfterViewInit() {
    console.log(
      `called when current component's child view has been initialized`,
      this.postImg
    );
  }
  ngAfterViewChecked() {
    console.log(
      `called when current component's child view has been checked`,
      this.postImg
    );
  }
  ngOnDestroy() {
    console.log('onDestroy called when leaving or reloading', this.postImg);
  }
}
