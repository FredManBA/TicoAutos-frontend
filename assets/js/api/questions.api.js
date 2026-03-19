import { requestJson } from "../utils/http.js";

export const createQuestion = (payload) =>
  requestJson("/questions", {
    method: "POST",
    auth: true,
    body: payload,
  });

export const getMyQuestions = () =>
  requestJson("/questions/mine", {
    method: "GET",
    auth: true,
  });

export const getReceivedQuestions = () =>
  requestJson("/questions/received", {
    method: "GET",
    auth: true,
  });

export const answerQuestion = (questionId, payload) =>
  requestJson(`/questions/${questionId}/answer`, {
    method: "POST",
    auth: true,
    body: payload,
  });
