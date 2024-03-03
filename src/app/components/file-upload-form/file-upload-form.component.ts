import { Component } from '@angular/core';
import {FileService} from "../../services/file.service";
import {ModalService} from "../../services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-file-upload-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './file-upload-form.component.html',
  styleUrl: './file-upload-form.component.css'
})
export class FileUploadFormComponent {

  selectedFile: File | undefined;

  constructor(private fileService: FileService,
              private modalService: ModalService,
              private router: ActivatedRoute,
              private http: HttpClient
  ) {
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(event.target.files[0]);
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('request', this.selectedFile);

      this.fileService.addFile(formData).subscribe(() => {
        console.log('Upload successful');
        window.location.reload()
      });
    }
  }
}
