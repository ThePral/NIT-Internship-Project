import { exec , execFile}  from 'child_process';
import fs from 'fs';
import util from 'util';

const execFilePromise = util.promisify(execFile);


export async function generatePdfWithWeasyPrint(htmlContent : string, filePath : string) {
    let tempHtmlPath = filePath.replace('.pdf', '.html');
    
    try {
        // Create temporary HTML file
        fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

        // Use execFile with array arguments to handle spaces automatically
        await execFilePromise('weasyprint', [
            '--encoding', 'utf-8',
            '--presentational-hints', // Better CSS support
            '--optimize-images', // Optimize images
            '--uncompressed-pdf', // Better for debugging if needed
            tempHtmlPath,
            filePath
          ]);
        
        // Clean up temporary HTML file
        fs.unlinkSync(tempHtmlPath);

        // Verify PDF was created
        if (!fs.existsSync(filePath)) {
            throw new Error('PDF file was not created');
        }

        console.log('PDF generated successfully with WeasyPrint:', filePath);
        return filePath;

    } catch (error) {
        // Clean up temp files in case of error
        try {
            if (fs.existsSync(tempHtmlPath)) {
                fs.unlinkSync(tempHtmlPath);
            }
        } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
        }
        
        throw new Error(`PDF generation failed: ${error.message}`);
    }
}