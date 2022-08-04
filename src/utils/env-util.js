import { ENV_ENUM } from "../constants/env.constant";

export function getEnv() {
  return process.env.NODE_ENV;
}

export function isProd() {
  return process.env.NODE_ENV === ENV_ENUM.PROD;
}

export function isDev() {
  return process.env.NODE_ENV === ENV_ENUM.DEV;
}

export function isTest() {
  return process.env.NODE_ENV === ENV_ENUM.TEST;
}

export function getRouterMode() {
  return isDev() ? "history" : "hash";
}
