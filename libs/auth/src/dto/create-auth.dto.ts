import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  identifier: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/, {
    message: 'Password too weak',
  })
  newPassword: string;
}
