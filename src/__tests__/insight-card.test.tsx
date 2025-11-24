import { render, screen } from '@testing-library/react';
import { InsightCard } from '@/components/features/analysis/insight-card';

describe('InsightCard Component', () => {
    const mockProps = {
        category: 'Impact & Achievements',
        score: 24,
        weight: 30,
        feedback: ['Strong quantifiable metrics', 'Good use of action verbs'],
        suggestions: ['Add more specific numbers', 'Include revenue impact']
    };

    it('renders category name', () => {
        render(<InsightCard {...mockProps} />);

        expect(screen.getByText('Impact & Achievements')).toBeInTheDocument();
    });

    it('displays score and weight', () => {
        render(<InsightCard {...mockProps} />);

        expect(screen.getByText('24/30 Points')).toBeInTheDocument();
    });

    it('shows feedback items', () => {
        render(<InsightCard {...mockProps} />);

        expect(screen.getByText('Strong quantifiable metrics')).toBeInTheDocument();
        expect(screen.getByText('Good use of action verbs')).toBeInTheDocument();
    });

    it('shows improvement suggestions', () => {
        render(<InsightCard {...mockProps} />);

        expect(screen.getByText('Add more specific numbers')).toBeInTheDocument();
        expect(screen.getByText('Include revenue impact')).toBeInTheDocument();
    });

    it('displays "Strong" status for >= 80% score', () => {
        render(<InsightCard {...mockProps} score={25} weight={30} category="Test" feedback={[]} suggestions={[]} />);

        expect(screen.getByText('Strong')).toBeInTheDocument();
    });
});
