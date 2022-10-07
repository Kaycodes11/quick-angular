import {Component, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {v4 as uuid} from 'uuid';
import {last, switchMap} from 'rxjs/operators';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import {ClipService} from "../../services/clip.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait, The clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireStorage;

  title = new FormControl("", [Validators.required, Validators.minLength(3)]);
  uploadForm = new FormGroup({title: this.title})

  constructor(private storage: AngularFireStorage, private auth: AngularFireAuth, private clipsService: ClipService, private router: Router) {
    auth.user.subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.task?.cancel()
  }

  storeFile(event: Event) {
    this.isDragover = false;
    this.file = (event as DragEvent).dataTransfer ?
      (event as DragEvent).dataTransfer?.files.item(0) ?? null : (event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') return;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.nextStep = true;
  }

  uploadFile() {
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait, The clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    // @ts-ignore
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    // @ts-ignore
    this.task!.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });
    // @ts-ignore
    this.task.snapshotChanges().pipe(
      last(), switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url: string) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${clipFileName}.mp4` as string,
          url: url as string,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const clipDocRef = await this.clipsService.createClip(clip);

        this.alertColor = 'green';
        this.alertMsg = 'Success, The clip has been successfully uploaded';
        this.showPercentage = false;
        setTimeout(() => {
          this.router.navigate(['clip', clipDocRef.id])
        }, 1000)
      },
      error: (error: any) => {
        this.uploadForm.enable();

        this.alertColor = 'red';
        this.alertMsg = 'Upload failed, please try again later'
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error);
      },
    });
  }


}
