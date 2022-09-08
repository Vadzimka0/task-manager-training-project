import { UserStatisticsApiType } from '../../user/types/user-statistics-api.type';

export type TaskStatisticsApiType = Pick<
  UserStatisticsApiType,
  'created_tasks' | 'completed_tasks'
>;
