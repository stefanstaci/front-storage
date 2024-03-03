import {Component, OnInit} from '@angular/core';
import {Observable, tap} from "rxjs";
import {IStorageFiles} from "../../components/models/IStorageFile";
import {FileService} from "../../services/file.service";
import {ModalService} from "../../services/modal.service";
import {GlobalErrorComponent} from "../../components/global-error/global-error.component";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FileComponent} from "../../components/file/file.component";
import {FileUploadFormComponent} from "../../components/file-upload-form/file-upload-form.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-file-page',
  standalone: true,
  imports: [
    GlobalErrorComponent,
    NgStyle,
    FormsModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    FileComponent,
    FileUploadFormComponent,
    ModalComponent,
    RouterLink
  ],
  templateUrl: './file-page.component.html',
  styleUrl: './file-page.component.css'
})
export class FilePageComponentimplements implements OnInit{
  title = 'DataStorage'
  // files: IStorageFiles[] = []
  files$!: Observable<IStorageFiles[]>
  loading = false
  term = ''

  constructor(
    private fileService: FileService,
    public modalService: ModalService,
    private router: Router
) {
  }



  modalType!: string;

  openModal(type: string) {
    this.modalType = type;
    this.modalService.open();
  }

  ngOnInit(): void {
    this.loading = true
    this.files$ = this.fileService.getAllFiles()
      .pipe(tap( () => this.loading = false))
    // this.fileService.getAllFiles().subscribe( files => {
    //   this.files = files
    //   this.loading = false
    // })
  }

  isImage(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension === 'docx' || extension === 'pdf' || extension === 'jpeg' || extension === 'gif';
  }

  getImageUrl(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') {
      return '../../../assets/pdf.png';
    } else if (extension === 'docx') {
      return '../../../assets/docx.png';
    } else {
      return '../../../assets/filepng.png';
    }
  }

  deleteFile(fileName: string) {
    return this.fileService.deleteFile(fileName).subscribe(() => {
      console.log(this.router.url)
      window.location.reload()
    })
  }
}
