import { Component } from '@angular/core';
import {FileService} from "../../services/file.service";
import {ModalService} from "../../services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-file-upload-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
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

  errorMessage: string | null = null;
  successMessage: string | null = null;

  onSubmit(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('request', this.selectedFile);

    this.errorMessage = null;
    this.successMessage = null;

    this.fileService.addFile(formData).subscribe({
      next: () => {
        this.successMessage = 'Fișierul a fost încărcat cu succes.';
        console.log('Upload successful');

        // opțional – fără reload
        // this.loadFiles();

        // dacă vrei neapărat reload:
        setTimeout(() => window.location.reload(), 1000);
      },
      error: (err) => {
        console.error(err);

        this.errorMessage =
          'Fișierul nu a fost încărcat. Verificați tipul fișierului sau spațiul de stocare disponibil.';
      }
    });
  }

}
