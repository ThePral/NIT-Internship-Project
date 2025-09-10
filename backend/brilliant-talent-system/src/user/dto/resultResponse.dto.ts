import { ApiProperty } from '@nestjs/swagger';
import { PriorityResultDto } from './result.dto';

export class StudentResultDto {
  @ApiProperty({
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    example: 'Smith',
  })
  lastname: string;

  @ApiProperty({
    example: 18.78,
  })
  points: number;

  @ApiProperty({
    example: { name: 'دانشگاه صنعتی نوشیروانی بابل' },
  })
  university: {
    name: string;
  };

  @ApiProperty({
    type: PriorityResultDto,
    isArray: true,
    example: [
      {
        priority: 1,
        minorName: 'مهندسی نرم افزار',
        capacity: 5,
        studentRank: 2,
        lastAcceptedRank: 7,
        isAccepted: true,
      },
      {
        priority: 2,
        minorName: 'هوش مصنوعی',
        capacity: 3,
        studentRank: 4,
        lastAcceptedRank: 3,
        isAccepted: false,
      },
      {
        priority: 3,
        minorName: 'امنیت',
        capacity: 6,
        studentRank: 10,
        lastAcceptedRank: 7,
        isAccepted: false,
      },
    ],
  })
  priorities: PriorityResultDto[];
}
