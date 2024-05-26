export const convertToFormData = <T extends Record<string, any>>(data: T): FormData => {
  const formData = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (isFile(value)) {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, String(value));
      }
    }
  }

  return formData;
};

function isFile(value: any): value is File {
  return value instanceof File;
}
