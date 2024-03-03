import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FileService} from "../../services/file.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent implements OnInit {

  constructor(private fileService: FileService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const filename = params['filename'];
      this.fileService.getFileContentByName(filename).subscribe(
        (fileContent: Blob) => {
          const fileURL = URL.createObjectURL(fileContent);
          const downloadLink = document.createElement('a');
          downloadLink.href = fileURL;
          downloadLink.download = filename;
          document.body.appendChild(downloadLink);
          downloadLink.click();

          downloadLink.addEventListener('load', () => {
            URL.revokeObjectURL(fileURL);
            document.body.removeChild(downloadLink);
          });
        },
        (error: any) => {
          console.error('Eroare la descărcarea fișierului:', error);
        }
      );
    });
    this.router.navigate(['/file'])
  }
}
