import _bcrypt from 'bcrypt';

import validator from '@/lib/backend/validator';

async function hashPassword(password: string): Promise<string> {
  return await _bcrypt.hash(password, 8);
}


// await bcrypt.compare()
function checkPassword(plainPassword: string, hashedPassword: string): void | never {
  if (!_bcrypt.compareSync(plainPassword, hashedPassword)) {
    validator.throwError(400, 'Invalid authentication data provided');
  }
}

export default {
  hashPassword,
  checkPassword
};