import { ApiProperty } from '@nestjs/swagger';

export class PriorityResultDto {
  //   firstname: string | null;
  //   lastname: string | null;
  //   points: number | null;
  //   university: {
  //     name: string;
  //   };
  @ApiProperty()
  priority: number;

  @ApiProperty()
  minorName: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  studentRank: number;

  @ApiProperty()
  lastAcceptedRank: number | null;

  @ApiProperty()
  isAccepted: boolean | null;
}
