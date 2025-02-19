import {Directive, ElementRef, HostListener,  OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Directive({
  selector: '[AutoFormError]'
})
export class AutoFormErrorDirective implements OnInit {
  @HostListener('submit', ['$event'])
  onSubmitAutoScroll(event: Event): void {
    this.displayFormErrors(event);
    this.autoScrollForFirstInvalidControl(event);

  }

  constructor(private translate: TranslateService, public elementRef: ElementRef) {

  }

  ngOnInit(): void {
  }

  autoScrollForFirstInvalidControl(event: Event): void {
    const firstInvalidControl: HTMLInputElement = document.querySelector('input.ng-invalid, select.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({behavior: 'smooth', block: 'center'});

    }
  }

  displayFormErrors(event: Event): void {
    const form = event.target as HTMLFormElement;
    const invalidInputs: NodeListOf<HTMLInputElement> = form.querySelectorAll(
      'input.ng-invalid, ng-select.ng-invalid, app-file-uploader.ng-invalid, p-editor.ng-invalid');
    const errorInputs = Array.from(invalidInputs).filter(p => p.required || p.validity?.patternMismatch || p.attributes.getNamedItem('required'));

    errorInputs.forEach(item => {
      const isAttachedEventListener = item.onkeyup !== null || item.onblur || item.onchange || item.onclick ;
      const isRequiredError = !item.validity?.patternMismatch;
      if (!isAttachedEventListener) {
        if (item.localName === 'app-file-uploader') {
          const uploadBorder = document.getElementById('upload-border');
          if (uploadBorder) {
            uploadBorder.classList.remove('border-success');
            uploadBorder.classList.add('border-danger');
          }
          const uploadIcon = document.getElementById('upload-icon');
          if (uploadIcon) {
            uploadIcon.classList.remove('text-success');
            uploadIcon.classList.add('text-danger');
          }

        } else {
          item.classList.add('error-input')
        }
        let parentNode = item.parentNode as any;
        if (parentNode.classList?.contains("input-group")) {
          parentNode = parentNode.parentNode;
        }
        const errorMessage ='This Field Is Required ';
        const errorTextP = document.createElement('small');
        errorTextP.className = 'text-danger my-1';
        errorTextP.id = 'error' + item.id;
        errorTextP.innerText = this.translate.instant(errorMessage);
        parentNode.appendChild(errorTextP);
        switch (item.localName)
        {
          case 'ng-select':
            item.onclick = ($event) => {

              setTimeout(() => {
                const invalidInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
                  'ng-select.ng-invalid');
                const invalidArray = Array.from( invalidInputs )
                if(!invalidArray.find(p=>p.name == item.name))
                {
                  const errorTextToDelete = document.getElementById('error' + item.id);
                  errorTextToDelete?.remove();
                  item.classList.remove('error-input')
                  item.onclick = null;
                }
              }, 100);
            }
            break;
          case 'app-file-uploader':
            item.onchange = ($event) => {
              // @ts-ignore
              if ($event.target['value']) {
                const uploadBorder = document.getElementById('upload-border');
                if (uploadBorder) {
                  uploadBorder.classList.remove('border-danger');
                  uploadBorder.classList.add('border-primary');
                }
                const uploadIcon = document.getElementById('upload-icon');
                if (uploadIcon) {
                  uploadIcon.classList.remove('text-danger fw-bold');
                  uploadIcon.classList.add('text-primary');
                }
                const errorTextToDelete = document.getElementById('error' + item.id);
                errorTextToDelete?.remove();
                item.onchange = null;
              }

            }
              break;
          default:
          {
            item.onkeyup = () => {
              if (item.validity.valid) {
                const errorTextToDelete = document.getElementById('error' + item.id);
                errorTextToDelete?.remove();
                item.classList.remove('error-input')
                item.onkeyup = null;
              } else {
                if (item.value) {
                //   errorTextP.innerText = this.translate.instant(InputPatternsErrorMessages.get(item.pattern));
                }
              }
            };
            item.onblur = () => {
              if (item.validity.valid) {
                const errorTextToDelete = document.getElementById('error' + item.id);
                errorTextToDelete?.remove();
                item.classList.remove('error-input')
                item.onblur = null;
              }
            };
            break;
          }
        }

      }
    });
  }

}
