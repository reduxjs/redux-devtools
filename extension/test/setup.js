import { jest } from '@jest/globals';
import * as chrome from 'sinon-chrome';

global.chrome = chrome;
import '@testing-library/jest-dom';

jest.setTimeout(50000);
