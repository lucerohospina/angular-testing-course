import { CoursesService } from "./courses.service";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('Courses Service', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses().subscribe(
      courses => {
        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12, 'incorrect number of courses');

        const course = courses.find(course => course.id = 12);

        console.log('course', course);

        // expect(course.titles.description).toBe('Angular Testing Course');
      });

      const req = httpTestingController.expectOne('/api/courses');
      expect(req.request.method).toEqual('GET');

      req.flush({ payload: Object.values(COURSES) });
  });

  it('should find course by Id', () => {
    coursesService.findCourseById(12).subscribe(
      course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[12]);
  });

  it('should save course data', () => {
    const changes: Partial<Course> = { titles: {description: 'Testing Course'} };

    coursesService.saveCourse(12, changes).subscribe(
      course => {
        expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual('Testing Course');

    req.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = { titles: {description: 'Testing Course'} };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail('save course should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      });

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');
    
    req.flush('Save course failed', { status: 500, statusText: 'Internal Server Error Message' });
  });

  it('should find lessos by Id', () => {
    coursesService.findLessons(12).subscribe(
      lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

      const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('courseId')).toEqual('12');
      expect(req.request.params.get('filter')).toEqual('');
      expect(req.request.params.get('sortOrder')).toEqual('asc');
      expect(req.request.params.get('pageNumber')).toEqual('0');
      expect(req.request.params.get('pageSize')).toEqual('3');

      req.flush({
        payload: findLessonsForCourse(12).slice(0, 3)
      });
  });

  afterEach(() => {
    httpTestingController.verify();
  })
});
