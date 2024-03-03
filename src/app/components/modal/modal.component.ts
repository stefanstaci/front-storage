import {Component, Input} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    TitleCasePipe
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title!: string

  constructor(public modalService: ModalService) {
  }
}
