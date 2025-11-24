import { render, screen } from '@testing-library/react';
import { ScoreGauge } from '@/components/features/analysis/score-gauge';

describe('ScoreGauge Component', () => {
    it('renders score value', () => {
        render(<ScoreGauge score={85} size={200} />);

        expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('renders "Score" label', () => {
        render(<ScoreGauge score={85} size={200} />);

        expect(screen.getByText('Score')).toBeInTheDocument();
    });

    it('renders different score values correctly', () => {
        const { rerender } = render(<ScoreGauge score={70} size={200} />);
        expect(screen.getByText('70')).toBeInTheDocument();

        rerender(<ScoreGauge score={50} size={200} />);
        expect(screen.getByText('50')).toBeInTheDocument();
    });
});
