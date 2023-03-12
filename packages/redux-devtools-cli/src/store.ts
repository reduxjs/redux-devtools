import { v4 as uuidV4 } from 'uuid';
import { pick } from 'lodash-es';
import { AGServer } from 'socketcluster-server';
import { Knex } from 'knex';
import connector from './db/connector.js';

const reports = 'remotedev_reports';
// var payloads = 'remotedev_payloads';
let knex: Knex;

const baseFields = ['id', 'title', 'added'];

function error(msg: string): Promise<{ error: string }> {
  return new Promise(function (resolve) {
    return resolve({ error: msg });
  });
}

type ReportType = 'STATE' | 'ACTION' | 'STATES' | 'ACTIONS';

export interface Report {
  id: string;
  type: ReportType | null;
  title: string | null;
  description: string | null;
  action: string | null;
  payload: string;
  preloadedState: string | null;
  screenshot: string | null;
  userAgent: string | null;
  version: string | null;
  userId: string | null;
  user: string | null;
  meta: string | null;
  exception: string | null;
  instanceId: string | null;
  added: string | null;
  appId?: string | null;
}

export interface ReportBaseFields {
  id: string;
  title: string | null;
  added: string | null;
}

function list(query?: string, fields?: string[]): Promise<ReportBaseFields[]> {
  const r = knex.select(fields || baseFields).from(reports);
  if (query) return r.where(query);
  return r;
}

function listAll(query?: string): Promise<Report[]> {
  const r = knex.select().from(reports);
  if (query) return r.where(query);
  return r;
}

function get(id: string): Promise<Report | { error: string }> {
  if (!id) return error('No id specified.');

  return knex(reports).where('id', id).first();
}

export interface AddData {
  type: ReportType | null;
  title: string | null;
  description: string | null;
  action: string | null;
  payload: string;
  preloadedState: string | null;
  screenshot: string | null;
  version: string | null;
  userAgent: string | null;
  userId: string | null;
  user: { id: string } | string | null;
  instanceId: string | null;
  meta: string | null;
  exception?: Error;
  appId?: string | null;
}

function add(data: AddData): Promise<ReportBaseFields | { error: string }> {
  if (!data.type || !data.payload) {
    return error("Required parameters aren't specified.");
  }
  if (data.type !== 'ACTIONS' && data.type !== 'STATE') {
    return error('Type ' + data.type + ' is not supported yet.');
  }

  const reportId = uuidV4();
  const report: Report = {
    id: reportId,
    type: data.type,
    title:
      data.title || (data.exception && data.exception.message) || data.action,
    description: data.description,
    action: data.action,
    payload: data.payload,
    preloadedState: data.preloadedState,
    screenshot: data.screenshot,
    version: data.version,
    userAgent: data.userAgent,
    user: data.user as string,
    userId:
      typeof data.user === 'object'
        ? (data.user as { id: string }).id
        : data.user,
    instanceId: data.instanceId,
    meta: data.meta,
    exception: composeException(data.exception),
    added: new Date().toISOString(),
  };
  if (data.appId) report.appId = data.appId; // TODO check if the id exists and we have access to link it
  /*
  var payload = {
    id: uuid.v4(),
    reportId: reportId,
    state: data.payload
  };
  */

  return knex
    .insert(report)
    .into(reports)
    .then(function () {
      return byBaseFields(report);
    });
}

function byBaseFields(data: Report): ReportBaseFields {
  return pick(data, baseFields) as ReportBaseFields;
}

export interface Store {
  list: (query?: string, fields?: string[]) => Promise<ReportBaseFields[]>;
  listAll: (query?: string) => Promise<Report[]>;
  get: (id: string) => Promise<Report | { error: string }>;
  add: (data: AddData) => Promise<ReportBaseFields | { error: string }>;
}

function createStore(options: AGServer.AGServerOptions): Store {
  knex = connector(options);

  return {
    list: list,
    listAll: listAll,
    get: get,
    add: add,
  };
}

function composeException(exception: Error | undefined) {
  let message = '';

  if (exception) {
    message = 'Exception thrown: ';
    if (exception.message) message += exception.message;
    if (exception.stack) message += '\n' + exception.stack;
  }
  return message;
}

export default createStore;
