import { AssertionLocals, DispatcherLocals, WrapLocals } from '../../types';

export const name = 'Mocha template';

export const dispatcher = ({ action }: DispatcherLocals) => `${action!};`;

export const assertion = ({ path, curState }: AssertionLocals) =>
  `expect(store${path}).toEqual(${curState!});`;

export const wrap = ({
  name,
  actionName,
  initialState,
  assertions,
}: WrapLocals) =>
  `import expect from 'expect';
import ${name!} from '../../stores/${name!}';

describe('${name!}', () => {
  it('${actionName!}', () => {
    const store = new ${name!}(${initialState!});
    ${assertions}
  });
});
`;

export default { name, assertion, dispatcher, wrap };
