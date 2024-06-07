import * as bcrypt from "bcrypt";

export const hashPassword = (password: string): string => bcrypt.hashSync(password, 10);
