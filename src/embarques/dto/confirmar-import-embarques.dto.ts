import { ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmbarqueDto } from './create-embarque.dto';

export class ConfirmarImportEmbarquesDto {
    @ValidateNested({ each: true })
    @Type(() => CreateEmbarqueDto)
    @ArrayMinSize(1)
    embarques!: CreateEmbarqueDto[];
}