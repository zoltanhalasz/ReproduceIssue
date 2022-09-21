import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ReproduceIssue';
  form = new FormGroup({});
  model = {
    AdditionalAttributes: [ {Name: 'example1', Value: 'example1Value'},
    {Name: 'example2', Value: 'example2Value'},
    {Name: 'example3', Value: 'example3Value'},
  ]
  };
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
    },
  };

  fields: FormlyFieldConfig[] = [{
    fieldGroup:
      [
        {
          key: "AdditionalAttributes",
          type: "additional-attributes",
          className: "row col-12",
          props: {
            label: 'Additional Attributes',
            placeholder: 'Additional Attributes...',
            disabled: this.options.formState.disabled
          },
        }
      ]

  }];

  constructor() { };

  submit() {
  }


}
