import { IsString, IsIn } from 'class-validator';

export class ChangeRoleDto {
  @IsString()
  @IsIn(['user', 'admin'], {
    message: 'Le rôle doit être soit "user" soit "admin"'
  })
  role: string;
}
