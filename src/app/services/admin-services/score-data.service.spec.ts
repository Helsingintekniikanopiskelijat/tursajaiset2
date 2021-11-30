/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ScoreDataService } from './score-data.service';

describe('Service: ScoreData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreDataService]
    });
  });

  it('should ...', inject([ScoreDataService], (service: ScoreDataService) => {
    expect(service).toBeTruthy();
  }));
});
