export default function useUtils() {
  /**
   *
   * @param {string} str - the string to be converted to camelCase
   * @param {number} at - the index of the first character to be converted to camelCase (default: 0)
   * @returns
   */
  const upperCharAt = (str, at = 0) => {
    return str.charAt(at).toUpperCase();
  };

  /**
   * Create form Data element for Upload to Strapi
   * @param {FormData} file - The file(s) to upload. The value(s) can be a Buffer or Stream.
   * @param {string} refId - The ID of the entry which the file(s) will be linked to.
   * @param {string} name - Name of the File.
   * @param {string} ref - The unique ID (uid) of the model which the file(s) will be linked to (default: api::object.object )
   * @param {string} field - The field of the entry which the file(s) will be precisely linked to. (default: images)
   * @param {string} caption - Caption of the file.
   */
  const createFormData = (file, refId, name, caption, ref = 'api::object.object', field = 'images') => {
    const formData = new FormData();

    formData.append('files', file, `${name}_${toLocalDate()}.${file.name.split('.').pop()}`);
    formData.append('refId', refId);
    formData.append('ref', ref);
    formData.append('field', field);
    formData.append(
      'fileInfo',
      `{"caption":"${
        caption ? caption : `Bauwerk: ${name}, Hochgeladen am: ${toLocalDate()}, Original Dateiname: ${file.name}`
      }","alternativeText":"${name}"}`
    );

    console.log('all files', formData.getAll('files'));
    return formData;
  };

  const UUID = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };

  /**
   * Create form Data element for Upload to Strapi
   * @param {Date} date - A Date
   * @param {boolean} time - Date with or without time (default: false)
   */
  const toLocalDate = (date, time = false) => {
    const asDate = date ? new Date(date) : new Date();

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    };

    if (time) {
      options.hourCycle = 'h24';
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return asDate.toLocaleDateString('de-DE', options);
  };

  return { upperCharAt, createFormData, UUID, toLocalDate };
}
