import { render, screen } from '@testing-library/react';
import { FileUpload } from '@/components/features/upload/file-upload';

describe('FileUpload Component', () => {
    it('renders upload area', () => {
        const mockCallback = jest.fn();
        render(<FileUpload onFileSelect={mockCallback} isUploading={false} />);

        expect(screen.getByText(/Drag & drop or click to browse/i)).toBeInTheDocument();
    });

    it('shows uploading state', () => {
        const mockCallback = jest.fn();
        render(<FileUpload onFileSelect={mockCallback} isUploading={true} />);

        expect(screen.getByText(/Analyzing resume/i)).toBeInTheDocument();
    });

    it('displays supported file types', () => {
        const mockCallback = jest.fn();
        render(<FileUpload onFileSelect={mockCallback} isUploading={false} />);

        expect(screen.getByText(/PDF, DOCX/i)).toBeInTheDocument();
    });
});
