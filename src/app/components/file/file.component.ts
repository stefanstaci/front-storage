import {Component, Input} from '@angular/core';
import {IStorageFiles} from "../models/IStorageFile";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: 'file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent {
  @Input() file!: IStorageFiles

  constructor() {
  }
}
