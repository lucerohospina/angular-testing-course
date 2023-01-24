import { 
  ComponentFixture, 
  fakeAsync, 
  flush, 
  TestBed, 
  waitForAsync 
} from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoursesService } from '../services/courses.service';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let element: DebugElement;
  // let coursesService: CoursesService;
  let coursesService: any;

  const beginnerCourses = setupCourses()
    .filter(course => course.category === 'BEGINNER');

  const advancedCourses = setupCourses()
    .filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
  
    TestBed.configureTestingModule({
      imports: [ 
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).toBe(1, 'unexpected number of tabs');
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).toBe(1, 'unexpected number of tabs');
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).toBe(2, 'unexpected number of tabs');
  });

  xit("should display advanced courses when tab clicked", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mdc-tab'));

    click(tabs[1]);

    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = element.queryAll(By.css('.mat-mdc-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles');
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

      done();
    }, 500);
  });

  xit("should display advanced courses when tab clicked - fakeSync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mdc-tab'));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = element.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  fit("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mdc-tab'));

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // const cardTitles = element.queryAll(By.css('.mat-tab-body-active .card-title'));
      const cardTitles = element.queryAll(By.css('.courses-card-list .card-title'));

      expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles');
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });
  }));
});
