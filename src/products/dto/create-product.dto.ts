import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  image?: string;
}
