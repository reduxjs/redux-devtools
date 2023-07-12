import { mark, extract, refer } from '../src/helpers';

describe('Helpers', function () {
  it('mark', function () {
    expect(mark({ testData: 'test' }, 'testType')).toMatchSnapshot();
    expect(
      mark({ testData: 'test' }, 'testType', 'toString'),
    ).toMatchSnapshot();
  });

  it('extract', function () {
    expect(extract({ testData: 'test' }, 'testType')).toMatchSnapshot();
  });

  it('refer', function () {
    const TestClass = function (data: unknown) {
      return data;
    };
    const testInstance = new (TestClass as any)({
      testData: 'test',
    }) as unknown;
    expect(
      refer(testInstance, 'testType', false, [TestClass as any]),
    ).toMatchSnapshot();
  });
});
