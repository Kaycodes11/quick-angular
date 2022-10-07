import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import Clip from "../../models/clip.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClipService} from "../../services/clip.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: Clip | null = null;
  inSubmission = false;
  showAlert = false;
  alertColor = "blue";
  alertMsg = "Please wait, updating clip";
  @Output() update = new EventEmitter();

  clipID = new FormControl('', {nonNullable: true})
  title = new FormControl("", {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true
  });
  editForm = new FormGroup({title: this.title, id: this.clipID});

  constructor(private modal: ModalService, private clipService: ClipService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.activeClip) return;
    this.inSubmission = false;
    this.showAlert = false;


    this.activeClip.docId && this.clipID.setValue(this.activeClip.docId);
    this.title.setValue(this.activeClip.title);
  }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy() {
    this.modal.unregister('editClip');
  }

  async submit(event: Event) {
    event.preventDefault();
    if(!this.activeClip) return;
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait, updating clip';

    try {
    await this.clipService.updateClip(this.clipID.value, this.title.value)
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Error occurred, please try again later';
      return;
    }
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip)
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = "Successfully updated";
  }
}
