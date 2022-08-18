import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCheckListsItems1660480564580 implements MigrationInterface {
  name = 'SeedCheckListsItems1660480564580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('buy potatoes', 'done', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('peel potatoes', 'done', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('boil potatoes', 'done', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('eat potatoes', 'pending', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('buy apples', 'done', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('eat apples', 'pending', 2)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('buy lemons', 'pending', 4)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('buy grapes', 'done', 6)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('wash grapes', 'pending', 6)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('eat grapes', 'pending', 6)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('eat oranges', 'done', 7)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('buy peaches', 'pending', 8)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('eat peaches', 'pending', 8)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('buy plums', 'done', 9)`,
    );
    await queryRunner.query(
      `INSERT INTO checklist_items ("itemTitle", status, "checklistId") VALUES ('eat plums', 'done', 9)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
