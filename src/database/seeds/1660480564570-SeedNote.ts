import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedNote1660480564570 implements MigrationInterface {
  name = 'SeedNote1660480564570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('read book', 'red', 'done', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('write article', 'green', 'pending', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('read news', 'red', 'pending', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('finish task', 'red', 'pending', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('buy meat', 'yellow', 'done', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('buy milk', 'yellow', 'done', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('buy pizza', 'yellow', 'pending', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('buy beer', 'yellow', 'pending', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('buy water', 'yellow', 'pending', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('watch youtube', 'green', 'done', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('watch twitch', 'green', 'done', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('visit mother', 'blue', 'pending', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('visit granny', 'blue', 'done', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('listen to music', 'yellow', 'pending', 3)`,
    );
    await queryRunner.query(
      `INSERT INTO notes (description, color, status, "authorId") VALUES ('listen to podcast', 'yellow', 'pending', 3)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
