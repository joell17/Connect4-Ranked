const RankingService = require("../src/services/rankingService");

describe("RankingService", () => {
    test("CalculateExpectedScore should return the correct expected score", () => {
        const expectedScore = RankingService.CalculateExpectedScore(1500, 1600);
        expect(expectedScore).toBeCloseTo(0.359935, 5);
    });

    test("CalculateNewRating should return the correct new rating for a win", () => {
        const newRating = RankingService.CalculateNewRating(1500, 1600, 'win');
        expect(newRating).toBeGreaterThan(1500);
    });

    test("CalculateNewRating should return the correct new rating for a loss", () => {
        const newRating = RankingService.CalculateNewRating(1500, 1600, 'lose');
        expect(newRating).toBeLessThan(1500);
    });

    test("CalculateNewRating should not exceed the ELO cap", () => {
        const newRating = RankingService.CalculateNewRating(2490, 2500, 'win');
        expect(newRating).toBe(RankingService.ELO_CAP);
    });

    test("DetermineDivision should return the correct division based on rating", () => {
        expect(RankingService.DetermineDivision(1100)).toBe('Bronze');
        expect(RankingService.DetermineDivision(1600)).toBe('Diamond');
        expect(RankingService.DetermineDivision(2500)).toBe('Masters');
    });
});
