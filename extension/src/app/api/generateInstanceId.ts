let id = 0;

export default function generateId(instanceId: number | undefined) {
  return instanceId || ++id;
}
