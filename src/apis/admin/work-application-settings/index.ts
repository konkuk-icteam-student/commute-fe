export { WORK_APPLICATION_SETTINGS_URL } from "./work-application-settings.endpoint";
export { WORK_APPLICATION_SETTINGS_QUERY_KEY } from "./work-application-settings.key";

export type {
  ConfiguredWorkApplicationSettings,
  GetWorkApplicationSettingsRequest,
  GetWorkApplicationSettingsResponse,
  SaveWorkApplicationSettingsRequest,
  SaveWorkApplicationSettingsResponse,
  WorkApplicationSettings,
} from "./work-application-settings.types";

export {
  getWorkApplicationSettingsApi,
  saveWorkApplicationSettingsApi,
} from "./work-application-settings.api";

export {
  useGetWorkApplicationSettingsQuery,
  useSaveWorkApplicationSettingsMutation,
} from "./work-application-settings.queries";
