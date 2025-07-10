const fs = require('fs')
const K =32;

function getExpectedScore(ratingA,ratingB,) {
    return 1/ (1+ Math.pow(10, (ratingB - ratingA) / 400));
}

function updateRatings(ratingA,ratingB, scoreA, scoreB){
  const expectedA = getExpectedScore(ratingA, ratingB);
  const expectedB = getExpectedScore(ratingB, ratingA);
  const total = scoreA+ scoreB;
  let normA = 0.5, normB = 0.5;
  if (total > 0) {
    normA = scoreA / total;
    normB = scoreB / total;
  }
  const newRatingA = ratingA + K * (normA - expectedA);
  const newRatingB = ratingB + K * (normB - expectedB);

  return {
    newRatingA: Math.round(newRatingA),
    newRatingB: Math.round(newRatingB),
  };
}

function processMatches() {
    let users = JSON.parse(fs.readFileSync('users.json'));
    let matches = JSON.parse(fs.readFileSync('matches.json'));

    let updated = false;

    for (let match of matches) {
        if (match.rated) continue;

        const traderA = users.find(u => u.username === match.traderA);
    const traderB = users.find(u => u.username === match.traderB);
    if (!traderA || !traderB) continue;

    if (typeof match.scoreA !== 'number' || typeof match.scoreB !== 'number') continue;

    const { newRatingA, newRatingB } = updateRatings(
      traderA.rating,
      traderB.rating,
      match.scoreA,
      match.scoreB
    );


    traderA.rating = newRatingA;
    traderB.rating = newRatingB;
    match.rated = true;
    updated = true;
    }
     if (updated) {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 4));
    fs.writeFileSync('matches.json', JSON.stringify(matches, null, 4));
    console.log('Ratings updated at', new Date().toLocaleString());
  } else {
    console.log('No new matches to rate at', new Date().toLocaleString());
  }
}
module.exports = { processMatches };
