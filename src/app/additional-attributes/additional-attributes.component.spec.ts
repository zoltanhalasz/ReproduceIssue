import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAttributesComponent } from './additional-attributes.component';

describe('AdditionalAttributesComponent', () => {
  let component: AdditionalAttributesComponent;
  let fixture: ComponentFixture<AdditionalAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalAttributesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
