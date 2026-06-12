import type {
  GroupStats,
  Match,
  Participant,
  ParticipantStats,
  Prediction,
  PredictionDetail,
  Standing,
} from "@/types";

export function calculatePredictionPoints(
  match: Match,
  prediction?: Prediction | null,
): number {
  if (
    match.status !== "Finalizado" ||
    !match.actualResult ||
    !prediction
  ) {
    return 0;
  }

  return prediction.prediction === match.actualResult ? 1 : 0;
}

export function getParticipantPredictionDetails(
  participantId: string,
  matches: Match[],
  predictions: Prediction[],
): PredictionDetail[] {
  const predictionsByMatch = new Map(
    predictions
      .filter((prediction) => prediction.participantId === participantId)
      .map((prediction) => [prediction.matchId, prediction]),
  );

  return [...matches]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((match) => {
      const prediction = predictionsByMatch.get(match.id) ?? null;
      const points = calculatePredictionPoints(match, prediction);
      return {
        match,
        prediction,
        points,
        isCorrect: points === 1,
      };
    });
}

export function calculateParticipantStats(
  participant: Participant,
  matches: Match[],
  predictions: Prediction[],
): ParticipantStats {
  const details = getParticipantPredictionDetails(
    participant.id,
    matches,
    predictions,
  ).filter((detail) => detail.prediction);
  const evaluated = details.filter(
    ({ match }) => match.status === "Finalizado" && match.actualResult,
  );
  const hits = evaluated.filter(({ isCorrect }) => isCorrect).length;

  return {
    participant,
    points: hits,
    hits,
    misses: evaluated.length - hits,
    evaluatedPredictions: evaluated.length,
    pendingPredictions: details.length - evaluated.length,
    totalPredictions: details.length,
    accuracy: evaluated.length ? (hits / evaluated.length) * 100 : 0,
  };
}

export function calculateStandings(
  participants: Participant[],
  matches: Match[],
  predictions: Prediction[],
): Standing[] {
  const sorted = participants
    .map((participant) =>
      calculateParticipantStats(participant, matches, predictions),
    )
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.accuracy - a.accuracy ||
        a.participant.name.localeCompare(b.participant.name, "es"),
    );

  return sorted.map((stats, index) => {
    return {
      position: index + 1,
      participant: stats.participant,
      points: stats.points,
      hits: stats.hits,
      predictionsCount: stats.evaluatedPredictions,
      accuracy: stats.accuracy,
    };
  });
}

export function calculateGroupStats(
  matches: Match[],
  predictions: Prediction[],
): GroupStats[] {
  const groups = [...new Set(matches.map((match) => match.group))].sort();

  return groups.map((group) => {
    const groupMatches = matches.filter((match) => match.group === group);
    const matchIds = new Set(groupMatches.map((match) => match.id));
    const groupPredictions = predictions.filter((prediction) =>
      matchIds.has(prediction.matchId),
    );
    const completed = groupMatches.filter(
      (match) => match.status === "Finalizado" && match.actualResult,
    );
    const completedIds = new Set(completed.map((match) => match.id));
    const evaluatedPredictions = groupPredictions.filter((prediction) =>
      completedIds.has(prediction.matchId),
    );
    const matchesById = new Map(matches.map((match) => [match.id, match]));
    const hits = evaluatedPredictions.filter((prediction) => {
      const match = matchesById.get(prediction.matchId);
      return match && calculatePredictionPoints(match, prediction) === 1;
    }).length;

    return {
      group,
      totalMatches: groupMatches.length,
      completedMatches: completed.length,
      pendingMatches: groupMatches.length - completed.length,
      totalPredictions: evaluatedPredictions.length,
      hits,
      accuracy: evaluatedPredictions.length
        ? (hits / evaluatedPredictions.length) * 100
        : 0,
    };
  });
}

export function getParticipantsWhoHitMatch(
  match: Match,
  participants: Participant[],
  predictions: Prediction[],
): Participant[] {
  if (match.status !== "Finalizado" || !match.actualResult) {
    return [];
  }

  const participantIds = new Set(
    predictions
      .filter(
        (prediction) =>
          prediction.matchId === match.id &&
          calculatePredictionPoints(match, prediction) === 1,
      )
      .map((prediction) => prediction.participantId),
  );

  return participants.filter((participant) => participantIds.has(participant.id));
}
