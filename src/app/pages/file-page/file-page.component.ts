import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, tap} from "rxjs";
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
import {UserReservationService} from "../../services/user-reservation.service";
import {IUser} from "../../components/models/IUser";
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {FileEditComponent} from "../../components/file-edit/file-edit.component";
import {AppFileShareComponent} from "../../components/app-file-share/app-file-share.component";

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
    RouterLink,
    NavbarComponent,
    FileEditComponent,
    AppFileShareComponent,
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
  showOptions: boolean = false
  filteredFiles$!: Observable<IStorageFiles[]>;
  private searchTerm$ = new BehaviorSubject<string>('');


  constructor(
    private fileService: FileService,
    public modalService: ModalService,
    private router: Router,
    private reservationService: UserReservationService
) {
  }

  updateTerm(term: string) {
    this.searchTerm$.next(term);
  }


  modalType!: string;
  user$!: Observable<IUser>

  openModal(type: string) {
    this.modalType = type;
    this.modalService.open();
  }

  ngOnInit(): void {
    this.loading = true
    this.files$ = this.fileService.getAllFiles()
      .pipe(tap( () => this.loading = false))

    this.user$ = this.reservationService.getUser()

    // this.fileService.getAllFiles().subscribe( files => {
    //   this.files = files
    //   this.loading = false
    // })
    this.filteredFiles$ = combineLatest([this.files$, this.searchTerm$]).pipe(
      map(([files, term]) =>
        files.filter(f => f.filename.toLowerCase().includes(term.toLowerCase()))
      )
    );
  }

  isImage(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension === 'docx' || extension === 'pdf' || extension === 'jpeg' || extension === 'gif' || extension === 'txt';
  }

  getImageUrl(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') {
      return '../../../assets/pdf.png';
    } else if (extension === 'docx') {
      return '../../../assets/docx.png';
    } else if (extension === 'txt') {
      return '../../../assets/txt.png';
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

  encryptFile(fileName: string) {
    return this.fileService.encryptFile(fileName).subscribe(() => {
      console.log(this.router.url)
      window.location.reload()
    })
  }

  decryptFile(fileName: string) {
    return this.fileService.decryptFile(fileName).subscribe(() => {
      console.log(this.router.url)
      window.location.reload()
    })
  }

  selectedFileForEdit: string | null = null;

  editFile(filename: string) {
    this.selectedFileForEdit = filename;
    this.modalType = 'edit-file';
    this.modalService.open();
  }

  downloadFile(fileName: string) {
    this.fileService.getFileContentByName(fileName).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }


  selectedIndex: number | null = null;

  toggleOptions(i: number) {
    this.selectedIndex = this.selectedIndex === i ? null : i;
  }

  // shareFile(filename: string) {
  //   this.fileService.shareFile(filename).subscribe(link => {
  //     navigator.clipboard.writeText(link);
  //     alert('Link copiat în clipboard:\n' + link);
  //   });
  // }

  shareFile(filename: string) {
    this.selectedFileForShare = filename;
    this.modalType = 'share-file';
    this.modalService.open();
  }


  selectedFileForShare?: string;

  openShareModal(filename: string) {
    this.selectedFileForShare = filename;
    this.modalType = 'share-file';
    this.modalService.open();
  }

  canEdit(file: IStorageFiles): boolean {
    return !file.shared || file.permission === 'EDIT';
  }

  canDelete(file: IStorageFiles): boolean {
    return !file.shared;
  }

  canEncrypt(file: IStorageFiles): boolean {
    return !file.shared;
  }

  canShare(file: IStorageFiles): boolean {
    return !file.shared;
  }

  canDownload(file: IStorageFiles): boolean {
    return true; // toți pot descărca
  }

}
