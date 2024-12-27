import { UserRole } from "@prisma/client";

export class CreateAccesTokenDto {
  sub: string;
  email: string;
  role: UserRole
}
