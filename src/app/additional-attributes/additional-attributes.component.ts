import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { CancelEvent, EditEvent, GridComponent, SaveEvent } from '@progress/kendo-angular-grid';
import { of, Observable, map } from 'rxjs';

const formlyRow = (fieldConfig: FormlyFieldConfig[]) => {
  return {
    fieldGroupClassName: 'row',
    fieldGroup: fieldConfig
  };
};

export interface AdditionalAttributes {
  Name: string,
  Value: string
}

@Component({
  selector: 'additional-attributes',
  templateUrl: './additional-attributes.component.html',
  styleUrls: ['./additional-attributes.component.css']
})
export class AdditionalAttributesComponent extends FieldType<FieldTypeConfig> implements OnInit {

  dataList: AdditionalAttributes[] = [];
  isEditButtonVisible = true;
  isRemoveButtonVisible = true;
  isCancelButtonVisible = false;
  isSaveButtonVisible = false;

  isLineBeingEdited = false;

  isFormDisabled = false;
  isFormInvalid = false;

  public formGroup: FormGroup = new FormGroup({});
  private editedRowIndex: number = -1;

  canAddAdditionalAttribute = false;

  additionalAttributeForm = new FormGroup({});

  additionalAttributeModel = {} as AdditionalAttributes;

  additionalAttributeFields: FormlyFieldConfig[] = [];

  ngOnInit(): void {
    this.isFormDisabled = this.formControl.disabled;

    this.formGroup = new FormGroup({});

    this.additionalAttributeFields = [{
      fieldGroup:
        [
          formlyRow([
            {
              key: "Name",
              type: "input",
              className: "col-6",
              props: {
                label: 'lblName',
                placeholder: 'lblName',
                required: true,
                disabled: this.isFormDisabled,
                translate: true
              },
              validation: {
                messages: {
                  required: this.composeAndTranslateValidationMessage('lblName', 'lblFieldIsMissing', "{0}"),
                }
              },
              asyncValidators: {
                uniqueName: {
                  expression: (control: FormControl) => {
                    return of(this.dataList.map(d => d.Name).indexOf(control.value) == -1);
                  },
                  message: 'Name must be unique.',
                },
              },
            },
            {
              key: "Value",
              type: "input",
              className: "col-6",
              props: {
                label: 'lblValue',
                placeholder: 'lblValue',
                disabled: this.isFormDisabled,
                translate: true
              },
            }])
        ]

    }];
    this.dataList = this.formControl.value as AdditionalAttributes[];

  }

  composeAndTranslateValidationMessage(label: string, containerMessage: string, replaceWhat: string): string {
    return containerMessage.replace(replaceWhat, label);
  }

  editHandler(args: EditEvent): void {
    this.isLineBeingEdited = true;
    this.isEditButtonVisible = false;
    this.isRemoveButtonVisible = false;
    this.isCancelButtonVisible = true;
    this.isSaveButtonVisible = true;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      'Name': new FormControl(args.dataItem.Name, Validators.compose([Validators.required]), this.nameValidator(args.rowIndex)),
      'Value': new FormControl(args.dataItem.Value),
    });
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  nameValidator(currentIndex: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(this.dataList.filter((x, i) => i != currentIndex).map(d => d.Name).indexOf(control.value) !== -1).pipe(
        map(res => {
          return res ? { nameExists: true } : null;
        })
      );
    };
  }

  cancelHandler(args: CancelEvent): void {
    args.sender.closeRow(args.rowIndex);
    this.isEditButtonVisible = true;
    this.isRemoveButtonVisible = true;
    this.isCancelButtonVisible = false;
    this.isSaveButtonVisible = false;
    this.isLineBeingEdited = false;
    this.clearForm();
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    if (formGroup.status == 'VALID') {
      const data: AdditionalAttributes = formGroup.value;
      this.dataList[rowIndex] = data;
    }
    sender.closeRow(rowIndex);
    this.isEditButtonVisible = true;
    this.isRemoveButtonVisible = true;
    this.isCancelButtonVisible = false;
    this.isSaveButtonVisible = false;
    this.isLineBeingEdited = false;
    this.clearForm();
  }

  submit(): void {
    if (this.additionalAttributeForm.valid) {
      const data = { Name: this.additionalAttributeModel.Name, Value: this.additionalAttributeModel.Value };
      this.formControl.value.push(data);
      this.dataList = this.formControl.value as AdditionalAttributes[];
      this.clearForm();
    }
  }

  clearForm(): void {
    this.additionalAttributeForm.reset();
    this.additionalAttributeForm.markAsPristine();
    this.additionalAttributeForm.markAsUntouched();
  }

  deleteAttribute(rowIndex: number): void {
    this.dataList.splice(rowIndex, 1);
    this.isEditButtonVisible = true;
    this.isRemoveButtonVisible = true;
    this.isCancelButtonVisible = false;
    this.isSaveButtonVisible = false;
    this.clearForm();
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = -1;
    this.formGroup = new FormGroup({});
  }

  constructor() {
    super();
  }


}
