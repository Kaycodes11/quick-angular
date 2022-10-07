import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ClipService} from "../../services/clip.service";
import Clip from "../../models/clip.model";
import {ModalService} from "../../services/modal.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: Clip[] = [];
  activeClip: Clip | null = null;
  sort$: BehaviorSubject<string>

  constructor(private router: Router, private route: ActivatedRoute, private clipsService: ClipService, private modal: ModalService) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      // @ts-ignore
      this.videoOrder = params?.sort === '2' ? params?.sort : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipsService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docId: doc.id,
          ...doc.data()
        });
      })
    });
  }

  sort(event: Event) {
    const {value} = event.target as HTMLSelectElement;
    // this.router.navigateByUrl(`manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {sort: value}
    });
  }

  openModal($event: Event, clip: Clip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  update(event: Clip) {
    this.clips.forEach((element, index) => {
      if(element.docId == event.docId) {
        this.clips[index].title = event.title;
      }
    })
  }

  deleteClip (event: Event, clip: Clip) {
    event.preventDefault();
    this.clipsService.deleteClip(clip);

    this.clips.forEach((element, index) => {
      if(element.docId == clip.docId) {
        this.clips.splice(index, 1)
      }
    });

  }

}
