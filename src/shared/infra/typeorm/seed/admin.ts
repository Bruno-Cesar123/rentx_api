import { hash } from 'bcrypt';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

async function create() {
  const connection = getConnection();

  const id = uuidv4();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, admin, created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXX')
    `,
  );
}

create().then(() => console.log('user admin created'));
