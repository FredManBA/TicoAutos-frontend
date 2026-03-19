export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value).trim());

export const isPositiveNumber = (value) => !Number.isNaN(Number(value)) && Number(value) > 0;

export const isNonNegativeNumber = (value) =>
  !Number.isNaN(Number(value)) && Number(value) >= 0;

export const minLength = (value, limit) => String(value).trim().length >= limit;

export const isUrl = (value) => {
  try {
    new URL(String(value));
    return true;
  } catch (error) {
    return false;
  }
};

export const validateRegisterForm = ({ name, email, password, phone }) => {
  const errors = [];

  if (!isRequired(name)) {
    errors.push("El nombre es obligatorio.");
  } else if (!minLength(name, 3)) {
    errors.push("El nombre debe tener al menos 3 caracteres.");
  }

  if (!isRequired(email)) {
    errors.push("El correo es obligatorio.");
  } else if (!isEmail(email)) {
    errors.push("El formato del correo no es valido.");
  }

  if (!isRequired(password)) {
    errors.push("La contrasena es obligatoria.");
  } else if (!minLength(password, 8)) {
    errors.push("La contrasena debe tener al menos 8 caracteres.");
  }

  if (phone && String(phone).trim().length > 30) {
    errors.push("El telefono no debe superar 30 caracteres.");
  }

  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = [];

  if (!isRequired(email)) {
    errors.push("El correo es obligatorio.");
  } else if (!isEmail(email)) {
    errors.push("El formato del correo no es valido.");
  }

  if (!isRequired(password)) {
    errors.push("La contrasena es obligatoria.");
  }

  return errors;
};

export const validateVehicleFilters = (filters = {}) => {
  const errors = [];
  const { yearMin, yearMax, priceMin, priceMax } = filters;

  if (yearMin && !Number.isInteger(Number(yearMin))) {
    errors.push("El año mínimo debe ser un número entero.");
  }

  if (yearMax && !Number.isInteger(Number(yearMax))) {
    errors.push("El año máximo debe ser un número entero.");
  }

  if (yearMin && yearMax && Number(yearMin) > Number(yearMax)) {
    errors.push("El rango de años es inválido.");
  }

  if (priceMin && !isNonNegativeNumber(priceMin)) {
    errors.push("El precio minimo debe ser un numero valido.");
  }

  if (priceMax && !isNonNegativeNumber(priceMax)) {
    errors.push("El precio maximo debe ser un numero valido.");
  }

  if (priceMin && priceMax && Number(priceMin) > Number(priceMax)) {
    errors.push("El rango de precios es invalido.");
  }

  return errors;
};

export const validateVehicleForm = (payload = {}) => {
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (!isRequired(payload.brand)) {
    errors.push("La marca es obligatoria.");
  }

  if (!isRequired(payload.model)) {
    errors.push("El modelo es obligatorio.");
  }

  if (
    !isRequired(payload.year) ||
    !Number.isInteger(Number(payload.year)) ||
    Number(payload.year) < 1900 ||
    Number(payload.year) > currentYear + 1
  ) {
    errors.push("El año debe ser un entero válido.");
  }

  if (!isRequired(payload.price) || !isPositiveNumber(payload.price)) {
    errors.push("El precio debe ser mayor que cero.");
  }

  if (!isRequired(payload.description) || !minLength(payload.description, 10)) {
    errors.push("La descripcion debe tener al menos 10 caracteres.");
  }

  if (payload.mileage && !isNonNegativeNumber(payload.mileage)) {
    errors.push("El kilometraje no puede ser negativo.");
  }

  if (
    payload.transmission &&
    !["manual", "automatic"].includes(payload.transmission)
  ) {
    errors.push("La transmision es invalida.");
  }

  if (
    payload.fuelType &&
    !["gasoline", "diesel", "hybrid", "electric"].includes(payload.fuelType)
  ) {
    errors.push("El tipo de combustible es invalido.");
  }

  if (Array.isArray(payload.images)) {
    const invalidImage = payload.images.find((image) => !isUrl(image));
    if (invalidImage) {
      errors.push("Todas las imagenes deben ser URLs validas.");
    }
  }

  return errors;
};

export const validateQuestionMessage = (message) => {
  if (!isRequired(message)) {
    return ["El mensaje es obligatorio."];
  }

  if (!minLength(message, 5)) {
    return ["El mensaje debe tener al menos 5 caracteres."];
  }

  return [];
};
