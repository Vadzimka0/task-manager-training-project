import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCommentAttachments1663600212107 implements MigrationInterface {
  name = 'SeedCommentAttachments1663600212107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO comment_attachments (
        id,
        created_at,
        type,
        mimetype,
        path,
        name,
        comment_id
      ) 
      VALUES (
        'd0423523-88a5-4988-bf2a-458e1e7bfaed',
        '2022-12-10T17:00:00.000',
        'IMAGE',
        'image/jpeg',
        'uploads/comments-attachments/d0423523-88a5-4988-bf2a-458e1e7bfaed',
        'cat.jpeg',
        '3b07d1d1-e855-48fe-9e7d-d76266d066ee'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO comment_attachments (
        id,
        created_at,
        type,
        mimetype,
        path,
        name,
        comment_id
      ) 
      VALUES (
        'e640ea67-a833-47b9-b672-ef98f5e87181',
        '2022-12-10T17:00:00.000',
        'IMAGE',
        'image/jpeg',
        'uploads/comments-attachments/e640ea67-a833-47b9-b672-ef98f5e87181',
        'dog.jpeg',
        'a323b5fe-f460-43e9-86ea-869d919fc77a'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
