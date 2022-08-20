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
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('lorem@gmail.com', 'Lorem Seed', '$2b$10$Xs21k/ID/wMpYdxUOHN/Qe4yWHd7QJFMT/hagSeXQa69K5.16xMyG')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('ipsum@gmail.com', 'Ipsum Seed', '$2b$10$Hv6DU8ja31XA6zeG/mmAO.lsYR0rOznxnPq55GKodNpKbxMktaJwK')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('adam@gmail.com', 'Adam Seed', '$2b$10$Hv6DU8ja31XA6zeG/mmAO.lsYR0rOznxnPq55GKodNpKbxMktaJwK')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('alex@gmail.com', 'Alex Seed', '$2b$10$Hv6DU8ja31XA6zeG/mmAO.lsYR0rOznxnPq55GKodNpKbxMktaJwK')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('eric@gmail.com', 'Eric Seed', '$2b$10$Hv6DU8ja31XA6zeG/mmAO.lsYR0rOznxnPq55GKodNpKbxMktaJwK')`,
    );
    await queryRunner.query(
      `INSERT INTO users (email, username, password) VALUES ('eddy@gmail.com', 'Eddy Seed', '$2b$10$Hv6DU8ja31XA6zeG/mmAO.lsYR0rOznxnPq55GKodNpKbxMktaJwK')`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
