import cloneDeep from 'lodash.clonedeep';

export function copyToClipboard(object: any){
  try {
    const deepCopiedObject = cloneDeep(object);
    const jsonString = JSON.stringify(deepCopiedObject, null, 2);
    void navigator.clipboard.writeText(jsonString);
  } catch (err) {
    console.error('Error during copy: ', err);
  }
}
