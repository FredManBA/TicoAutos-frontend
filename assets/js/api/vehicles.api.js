import { buildQueryString } from "../utils/queryParams.js";
import { requestJson } from "../utils/http.js";

export const listVehicles = (filters = {}) =>
  requestJson(`/vehicles${buildQueryString(filters)}`, {
    method: "GET",
  });

export const getVehicleById = (vehicleId) =>
  requestJson(`/vehicles/${vehicleId}`, {
    method: "GET",
  });

export const getMyVehicles = () =>
  requestJson("/vehicles/mine", {
    method: "GET",
    auth: true,
  });

export const createVehicle = (payload) =>
  requestJson("/vehicles", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const updateVehicle = (vehicleId, payload) =>
  requestJson(`/vehicles/${vehicleId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });

export const markVehicleAsSold = (vehicleId) =>
  requestJson(`/vehicles/${vehicleId}/sold`, {
    method: "PATCH",
    auth: true,
  });

export const deleteVehicle = (vehicleId) =>
  requestJson(`/vehicles/${vehicleId}`, {
    method: "DELETE",
    auth: true,
  });

export const getVehicleQuestions = (vehicleId) =>
  requestJson(`/vehicles/${vehicleId}/questions`, {
    method: "GET",
    auth: true,
  });
