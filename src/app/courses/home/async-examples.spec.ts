import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Examples', () => {

  it('Asynchronous test example with Jasmine done', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions - done');
      test = true;

      expect(test).toBeTruthy();

      done();
    }, 1000);
  });

  it('Asynchronous test example - setTimeout', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions - setTimeout');
      test = true;

      // expect(test).toBeTruthy();
    }, 1000);

    // tick(1000);

    flush();

    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - plain promise', fakeAsync(() => {
    let test = false;

    console.log('creating promise');

    Promise.resolve().then(() => {
      console.log('FIRST promise evaluated successfully');

      test = true;

      return Promise.resolve();
    }).then(() => {
      console.log('SECOND promise evaluated successfully');
    });

    flushMicrotasks();

    console.log('running assertions - plain promise');

    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - promise and setTimeout', fakeAsync(() => {
    let counter = 0;

    console.log('creating promise');

    Promise.resolve().then(() => {
      console.log('promise evaluated successfully');

      counter += 10;

      setTimeout(() => {
        console.log('setTimeout evaluated successfully');

        counter += 1;
      }, 1000);
    });

    console.log('running assertions - promise and setTimeout');

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(1000);

    expect(counter).toBe(11);
  }));

  it('Asynchronous test example - observables',fakeAsync(() => {
    let test = false;

    console.log('creating observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log('running assertions - observables');

    expect(test).toBe(true);
  }));
});
