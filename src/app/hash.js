import * as bcrypt from 'bcryptjs';

async function hashPassword() {
  const hashedPassword = await bcrypt.hash('admin', 10);
  console.log(hashedPassword);
}

hashPassword();