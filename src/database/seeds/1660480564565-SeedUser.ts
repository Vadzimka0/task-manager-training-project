import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1660480564565 implements MigrationInterface {
  name = 'SeedUser1660480564565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // password is 'ag=='
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('foo@gmail.com', 'Foo Seed', '$2b$10$7hGSTUCDmiQD/GtRrtOsQuC.ifxQQ.QGbP69up/qT1owOeroh395m')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('bar@gmail.com', 'Bar Seed', '$2b$10$G11MFICj373SqWJRrnF7Me8EZLPwf46D7WipaIHphheJCX3lrSSO6')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('buz@gmail.com', 'Buz Seed', '$2b$10$kj7JwcR6q9.yw6U0fwCEt.3Vtz8NgMYFIjZFfcTj61Br0r1QMRXsa')`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
