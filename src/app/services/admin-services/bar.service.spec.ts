/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BarService } from './bar.service';

describe('Service: Bar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BarService]
    });
  });

  it('should ...', inject([BarService], (service: BarService) => {
    expect(service).toBeTruthy();
  }));
});
