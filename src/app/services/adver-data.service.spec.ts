/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdverDataService } from './adver-data.service';

describe('Service: AdverData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdverDataService]
    });
  });

  it('should ...', inject([AdverDataService], (service: AdverDataService) => {
    expect(service).toBeTruthy();
  }));
});
