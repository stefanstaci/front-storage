import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-file-edit',
  standalone: true,
  template: `
    <h2>Editare fișier: {{ filename }}</h2>

    <textarea
      [(ngModel)]="content"
      rows="20"
      style="width: 100%">
    </textarea>

    <div style="margin-top: 10px">
      <button (click)="save()">💾 Salvează</button>
      <button (click)="close()">❌ Anulează</button>
    </div>
  `,
  imports: [
    FormsModule
  ]
})
export class FileEditComponent implements OnInit {

  @Input() filename!: string;
  content = '';

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.getFileForEdit(this.filename)
      .subscribe(text => this.content = text);
  }

  save() {
    this.fileService.saveEditedFile(this.filename, this.content)
      .subscribe(() => alert('Fișier salvat cu succes'));
  }

  close() {
    window.location.reload();
  }
}
