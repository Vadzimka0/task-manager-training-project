import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTaskAttachments1663600212105 implements MigrationInterface {
  name = 'SeedTaskAttachments1663600212105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO task_attachments (
        id,
        type,
        mimetype,
        path,
        filename,
        task_id
      ) 
      VALUES (
        'fb855677-1e31-410c-9e2f-4782c143604b',
        'IMAGE',
        'image/jpeg',
        'uploads/tasks-attachments/fb855677-1e31-410c-9e2f-4782c143604b',
        'stade-de-france.jpg',
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO task_attachments (
        id,
        type,
        mimetype,
        path,
        filename,
        task_id
      ) 
      VALUES (
        '21f705d3-f6e1-4054-8cf5-36eabfef24f6',
        'FILE',
        'text/plain',
        'uploads/tasks-attachments/21f705d3-f6e1-4054-8cf5-36eabfef24f6',
        'text.txt',
        'bc50fa05-b625-4d2a-b7e6-41d1a7b331d0'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
