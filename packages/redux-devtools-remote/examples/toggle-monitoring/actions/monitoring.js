export const START_MONITORING = 'START_MONITORING';
export const STOP_MONITORING = 'STOP_MONITORING';
export const SEND_TO_MONITOR = 'SEND_TO_MONITOR';

export function startMonitoring() {
  return {
    type: START_MONITORING,
  };
}

export function stopMonitoring() {
  return {
    type: STOP_MONITORING,
  };
}

export function sendToMonitor() {
  return {
    type: SEND_TO_MONITOR,
  };
}
