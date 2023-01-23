import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from '@angular/core/testing';

describe('CaculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }
      ] 
    });

    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    // calculator = new CalculatorService(loggerSpy);
    calculator = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    // pending();

    // const logger = new LoggerService();
    //spyOn(logger, 'log');

    // const logger = jasmine.createSpyObj('LoggerService', ['log']);
    
    // const calculator = new CalculatorService(logger);

    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    // expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    // pending();
    // fail();

    // const logger = jasmine.createSpyObj('LoggerService', ['log']);
    // const calculator = new CalculatorService(new LoggerService());

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'unexpected subtraction result');
    // expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
