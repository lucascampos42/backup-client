import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlComponent } from './xml.component';

describe('XmlComponent', () => {
  let component: XmlComponent;
  let fixture: ComponentFixture<XmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
