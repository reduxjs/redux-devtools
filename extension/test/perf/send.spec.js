import 'babel-polyfill';
import expect from 'expect';
import { bigArray, bigString, circularData } from './data';
import { listenMessage } from '../utils/inject';
import '../../src/browser/extension/inject/pageScript';

function test(title, data, maxTime = 100) {
  it('should send ' + title, async() => {
    const start = new Date();
    await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send({ type: 'TEST_ACTION', data }, data);
    });
    const ms = new Date() - start;
    // console.log(ms);
    expect(ms).toBeLessThan(maxTime);
  });
}

describe('Perf', () => {
  test('a huge string', bigString);
  test('a huge array', bigArray);
  test('an object with circular references', circularData);
});
