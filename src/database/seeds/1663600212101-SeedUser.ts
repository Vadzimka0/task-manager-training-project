import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1663600212101 implements MigrationInterface {
  name = 'SeedUser1663600212101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // password is 'dGVzdDFwYXNz'
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'f60c913b-0859-4797-8dea-c07409ffcf0d',
        'lionelmessi@gmail.com', 
        'messi', 
        '$2b$10$CbmCObZNEQGa1vX3ueVa9ux6k7mfnrGeOtrJ6YwC3zh927/4qq32K',
        'image/jpeg',
        'uploads/users-avatar/f60c913b-0859-4797-8dea-c07409ffcf0d',
        'avatar-messi.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'cc6864ed-9ca0-40b7-a4aa-e17563ace1ce',
        'cristianoronaldo@gmail.com', 
        'cr7', 
        '$2b$10$uHCvozfLsswW1fWreKVjG.TNED6LrWSBhBKu9ZRqyn4zC44VBv8aS',
        'image/jpeg',
        'uploads/users-avatar/cc6864ed-9ca0-40b7-a4aa-e17563ace1ce',
        'avatar-ronaldo.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'fb4cad39-9add-4633-8050-b933ad1d7458',
        'rogerfederer@gmail.com', 
        'fedex', 
        '$2b$10$XIP0fWG8U7aVH3Hr1GNtzusQTFcVW15eMD90IKVdGIjpG5h5A91G.',
        'image/jpeg',
        'uploads/users-avatar/fb4cad39-9add-4633-8050-b933ad1d7458',
        'avatar-federer.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        '86fd5b28-eb9b-4c31-b19c-209a7ab050a4',
        'rafaelnadal@gmail.com', 
        'rafa', 
        '$2b$10$5ZunHlW1I2.ESaOse7GxieuQ13TZlrIbRVsVF/Dh.KDxtWjL4boOa',
        'image/jpeg',
        'uploads/users-avatar/86fd5b28-eb9b-4c31-b19c-209a7ab050a4',
        'avatar-nadal.jpg'
      )`,
    );
    await queryRunner.query(
      `INSERT INTO users (
        id,
        email, 
        username, 
        password,
        mimetype,
        path,
        filename
      ) 
      VALUES (
        'cfd356c8-4a50-4721-a424-ee685a7b2ebe',
        'nikolajokic@gmail.com', 
        'joker', 
        '$2b$10$XVngdMc5hEZl6VF0749uTeFv9FQO3Z1H1.H3G9zoMD.h2gF.AnUs.',
        'image/png',
        'uploads/users-avatar/cfd356c8-4a50-4721-a424-ee685a7b2ebe',
        'avatar-jokic.png'
      )`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
