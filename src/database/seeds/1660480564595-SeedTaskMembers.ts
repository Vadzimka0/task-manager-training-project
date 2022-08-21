import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTaskMembers1660480564595 implements MigrationInterface {
  name = 'SeedTaskMembers1660480564595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (5, 2)`);
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (5, 4)`);
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (5, 5)`);
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (6, 3)`);
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (6, 4)`);
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (6, 5)`);
    await queryRunner.query(`INSERT INTO tasks_members_users ("tasksId", "usersId") VALUES (7, 5)`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
