// public static class

class RankingService {
    static MAX_RATING_CHANGE = 30;
    static DIVISION_UPPER_THRESHOLDS = {
        'Iron': 1099,
        'Bronze': 1199,
        'Silver': 1399,
        'Gold': 1599,
        'Diamond': 1799,
        'Masters': 9999,  // The cap ranking should probably be something like 2500
    }
    static ELO_CAP = 2500;
    static ELO_MIN = 750;
    static ACTUAL_SCORES = {
        'win': 1,
        'draw': 0.5,
        'lose': 0  // Make lower if I want to make players lose more elo on a loss
    }

    static CalculateExpectedScore(RatingA, RatingB) {
        return (1) / (1 + Math.pow(10, (RatingB - RatingA) / 400));
    }

    static CalculateNewRating(RatingA, RatingB, ActualScoreKey) {
        let actualScore = RankingService.ACTUAL_SCORES[ActualScoreKey];
        let expectedScore = RankingService.CalculateExpectedScore(RatingA, RatingB);
        let newRating = Math.round(RatingA + RankingService.MAX_RATING_CHANGE * (actualScore - expectedScore));

        if (newRating < RankingService.ELO_MIN) newRating = RankingService.ELO_MIN;
        return newRating > RankingService.ELO_CAP ? RankingService.ELO_CAP : newRating;
    }

    static DetermineDivision(rating) {
        for (const [division, threshold] of Object.entries(RankingService.DIVISION_UPPER_THRESHOLDS)) {
            if (rating <= threshold) {
                return division;
            }
        }
        return 'Iron'; // Or whatever default division you prefer
    }   

}

module.exports = RankingService;