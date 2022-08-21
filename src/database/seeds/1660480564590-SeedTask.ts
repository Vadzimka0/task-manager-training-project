import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTask1660480564590 implements MigrationInterface {
  name = 'SeedTask1660480564590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('to sleep on time', 'turn off the computer at 22:00', '2022-09-21 00:00:00', 1, 1)`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('go to bed tonight on time', 'turn off the computer at 23:00', '2022-09-22 00:00:00', 2, 2)`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('set alarm', 'for 7 am', '2022-09-20 00:00:00', 2, 2)`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('have a beer at home', 'at 8:30', '2022-09-19 00:00:00', 10, 4)`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('meet with Bar Seed', 'at 10:30', '2022-09-18 00:00:00', 11, 2)`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('meet with Buz Seed', 'at 11:15', '2022-09-17 00:00:00', 11, 3)`,
    );
    await queryRunner.query(
      `INSERT INTO tasks (title, description, "dueDate", "tagId", "performerId") VALUES ('meet with Lorem Seed', 'at 11:30', '2022-09-16 00:00:00', 11, 4)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
