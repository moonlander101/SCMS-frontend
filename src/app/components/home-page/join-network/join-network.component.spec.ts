import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinNetworkComponent } from './join-network.component';

describe('JoinNetworkComponent', () => {
  let component: JoinNetworkComponent;
  let fixture: ComponentFixture<JoinNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinNetworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
