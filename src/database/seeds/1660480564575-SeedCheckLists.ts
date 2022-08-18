import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCheckLists1660480564575 implements MigrationInterface {
  name = 'SeedCheckLists1660480564575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('potatoes', 'yellow', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('apples', 'red', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('bananas', 'blue', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('lemons', 'green', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('melons', 'black', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('grapes', 'green', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('oranges', 'blue', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('peaches', 'red', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO checklists (title, color, "authorId") VALUES ('plums', 'yellow', 3)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
