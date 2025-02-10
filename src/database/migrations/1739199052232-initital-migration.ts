import { MigrationInterface, QueryRunner } from 'typeorm';

export class InititalMigration1739199052232 implements MigrationInterface {
  name = 'InititalMigration1739199052232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tenant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`database\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_56211336b5ff35fd944f225917\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_56211336b5ff35fd944f225917\` ON \`tenant\``,
    );
    await queryRunner.query(`DROP TABLE \`tenant\``);
  }
}
