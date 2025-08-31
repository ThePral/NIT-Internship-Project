import { applyDecorators, BadRequestException, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';

const destination = './resources'

export function ExcelUploadDecorator(fieldName = 'file') {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    destination: destination,
                    filename: (req, file, callback) => {
                        const type = req.params.type;
                        const nameMap = {
                            students1: 'Students1',
                            students2: 'Students2',
                            minors: 'minors',
                            universities: 'universities',
                        };
                        const baseName = nameMap[type];
                        if (!baseName) callback(new BadRequestException('Invalid or missing type field'), "null");
                        const fileName = baseName + extname(file.originalname);
                        callback(null, fileName);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                        return callback(new Error('Only Excel files are allowed!'), false);
                    }
                    callback(null, true);
                },
            }),
        ),
        ApiConsumes('multipart/form-data'),
        ApiParam({
            name: 'type',
            required: true,
            description: 'The type of Excel file to upload',
            schema: { type: 'string' },
            enum: ['students1','students2','minors','universities'] 
        }),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    [fieldName]: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        }),
    );
}
