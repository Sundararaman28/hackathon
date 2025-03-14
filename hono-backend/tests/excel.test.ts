import { describe, it, expect } from 'vitest'
import { downloadExcel } from '../controller/main'
import { createMockContext } from './utils'

describe('Excel Download API', () => {
    it('should generate excel file', async () => {
        const ctx = createMockContext();
        const response = await downloadExcel(ctx);

        expect(response.headers.get('Content-Type')).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(response.headers.get('Content-Disposition')).toContain('attachment');
    });

    it('should handle empty data', async () => {
        const ctx = createMockContext();
        const response = await downloadExcel(ctx);
        const data: { error: string } = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to generate Excel file.');
    });
});
