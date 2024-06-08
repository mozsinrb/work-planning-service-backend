import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ async: false })
class IsMongoIdConstraint implements ValidatorConstraintInterface {
  validate(id: any) {
    return Types.ObjectId.isValid(id);
  }

  defaultMessage() {
    return "workerId must be a valid MongoDB ObjectId";
  }
}

export function IsMongoId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMongoIdConstraint,
    });
  };
}

export class CreateShiftDto {
  @IsMongoId()
  @IsNotEmpty()
  workerId: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  @IsIn([0, 8, 16])
  startHour: number;
}
