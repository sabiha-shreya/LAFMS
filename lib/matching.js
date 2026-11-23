/**
 * Matching & Similarity calculation logic
 * Replicates PHP similar_text() and matching score calculations.
 */

// PHP similar_text equivalent
function similarText(first, second) {
  if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
    return 0;
  }
  first = String(first);
  second = String(second);
  let pos1 = 0, pos2 = 0, max = 0;
  const firstLength = first.length;
  const secondLength = second.length;

  for (let p = 0; p < firstLength; p++) {
    for (let q = 0; q < secondLength; q++) {
      let l = 0;
      while ((p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l))) {
        l++;
      }
      if (l > max) {
        max = l;
        pos1 = p;
        pos2 = q;
      }
    }
  }

  let sum = max;
  if (sum > 0) {
    if (pos1 > 0 && pos2 > 0) {
      sum += similarText(first.substring(0, pos1), second.substring(0, pos2));
    }
    if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
      sum += similarText(first.substring(pos1 + max), second.substring(pos2 + max));
    }
  }
  return sum;
}

function getSimilarity(text1, text2) {
  text1 = (text1 || '').toString().toLowerCase().trim();
  text2 = (text2 || '').toString().toLowerCase().trim();
  if (text1 === '' || text2 === '') return 0;
  if (text1 === text2) return 100;
  const common = similarText(text1, text2);
  const total = text1.length + text2.length;
  if (total === 0) return 0;
  return Math.round(((common * 2) / total) * 10000) / 100;
}

function calculateDateScore(lostDateStr, foundDateStr) {
  const lostTime = new Date(lostDateStr).getTime();
  const foundTime = new Date(foundDateStr).getTime();
  if (isNaN(lostTime) || isNaN(foundTime)) return 0;

  const diffDays = Math.abs(lostTime - foundTime) / (1000 * 60 * 60 * 24);
  if (diffDays === 0) return 100;
  if (diffDays <= 1) return 80;
  if (diffDays <= 3) return 60;
  if (diffDays <= 7) return 40;
  return 0;
}

function calculateMatchScores(lost, found) {
  const lostName = (lost.item_name || '').toLowerCase().trim();
  const foundName = (found.item_name || '').toLowerCase().trim();
  const itemNameScore = (lostName === foundName) ? 100 : getSimilarity(lostName, foundName);

  const lostDesc = (lost.description || '').toLowerCase().trim();
  const foundDesc = (found.description || '').toLowerCase().trim();
  const descriptionScore = getSimilarity(lostDesc, foundDesc);

  const lostCat = (lost.category || '').toLowerCase().trim();
  const foundCat = (found.category || '').toLowerCase().trim();
  const categoryScore = (lostCat === foundCat) ? 100 : 0;

  const lostLoc = (lost.lost_location || '').toLowerCase().trim();
  const foundLoc = (found.found_location || '').toLowerCase().trim();
  const locationScore = (lostLoc === foundLoc) ? 100 : getSimilarity(lostLoc, foundLoc);

  const dateScore = calculateDateScore(lost.lost_date, found.found_date);

  // Match Formula:
  // Item Name = 40%, Category = 25%, Location = 25%, Date = 10%
  const matchPercentage = Math.round((
    (itemNameScore * 0.40) +
    (categoryScore * 0.25) +
    (locationScore * 0.25) +
    (dateScore * 0.10)
  ) * 100) / 100;

  return {
    itemNameScore,
    descriptionScore,
    categoryScore,
    locationScore,
    dateScore,
    matchPercentage
  };
}

function calculateAdminMatchScores(lost, found) {
  const itemNameScore = getSimilarity(lost.item_name, found.item_name);
  const descriptionScore = getSimilarity(lost.description, found.description);
  const categoryScore = getSimilarity(lost.category, found.category);
  const locationScore = getSimilarity(lost.lost_location, found.found_location);
  const dateScore = getSimilarity(lost.lost_date, found.found_date);

  const matchPercentage = Math.round((
    (itemNameScore * 0.20) +
    (descriptionScore * 0.40) +
    (categoryScore * 0.10) +
    (locationScore * 0.20) +
    (dateScore * 0.10)
  ) * 100) / 100;

  return {
    itemNameScore,
    descriptionScore,
    categoryScore,
    locationScore,
    dateScore,
    matchPercentage
  };
}

module.exports = {
  similarText,
  getSimilarity,
  calculateDateScore,
  calculateMatchScores,
  calculateAdminMatchScores
};
