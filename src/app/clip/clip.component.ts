import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id = '';

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    // this works if data needed is from when component renders first time
    // this.id = this.route.snapshot.params['id'];

    // so if id updated since it's the same component Angular doesn't re-render the component so
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }

}
