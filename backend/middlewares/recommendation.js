const product = require("../models/productModel.js");
const math = require("mathjs");

// Calculate Cosine Similarity between two users
function cosineSimilarity(userA, userB) {
  const allItems = new Set([...Object.keys(userA), ...Object.keys(userB)]);
  const vectorA = Array.from(allItems).map((item) => userA[item] || 0);
  const vectorB = Array.from(allItems).map((item) => userB[item] || 0);

  const dotProduct = math.dot(vectorA, vectorB);
  const normA = math.norm(vectorA); // mag of A
  const normB = math.norm(vectorB); // mag of B

  // Avoid division by zero
  return normA && normB ? dotProduct / (normA * normB) : 0;
}

// Get user similarity scores
function getUserSimilarities(targetUserId, userItemData) {
  const targetUser = userItemData.find(
    (user) => user.userId.toString() === targetUserId
  );
  if (!targetUser) return [];

  return userItemData
    .filter((user) => user.userId.toString() !== targetUserId)
    .map((user) => {
      const similarity = cosineSimilarity(
        targetUser.interactions,
        user.interactions
      );
      return { userId: user.userId, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity);
}

// Get recommendations for a user based on similar users
function getRecommendations(targetUserId, userItemData) {
  const similarUsers = getUserSimilarities(targetUserId, userItemData);
  const targetUser = userItemData.find(
    (user) => user.userId.toString() === targetUserId
  );
//targeted user
  // console.log("Target User:", targetUser);
  // console.log("Similar Users:", similarUsers);

  if (!targetUser || Object.keys(targetUser.interactions).length === 0) {
    return { message: "No recommendations found due to lack of interactions" };
  }

  if (similarUsers.length === 0) return { message: "No recommendations found" };

  const recommendedItems = {};
  let totalSimilarity = 0;

  similarUsers.forEach((similarUser) => {
    if (similarUser.similarity > 0) {
      totalSimilarity += similarUser.similarity;

      const similarUserData = userItemData.find(
        (user) => user.userId.toString() === similarUser.userId.toString()
      );
      // console.log("Similar User Data:", similarUserData);
      Object.entries(similarUserData.interactions).forEach(([item, rating]) => {
        // Check if the target user has already interacted with this item
        if (!targetUser.interactions[item]) {
          recommendedItems[item] =
            (recommendedItems[item] || 0) + rating * similarUser.similarity;

          // console.log(
          //   `Adding item ${item} w rating ${rating}similarity ${similarUser.similarity}`
          // );
        } else {
          // console.log(`Skipping item ${item} for target user ${targetUserId}`);
        }
      });
    }
  });

  // console.log("Recommended Items:", recommendedItems);
  // console.log("Total Similarity:", totalSimilarity);

  if (totalSimilarity === 0) return { message: "No recommendations found" };

  // Normalize by total similarity to ensure fair weighting
  const normalizedRecommendations = Object.keys(recommendedItems).map(
    (item) => ({
      item,
      score: recommendedItems[item] / totalSimilarity,
    })
  );

  // console.log("Normalized Recommendations:", normalizedRecommendations);

  // Return sorted recommendations based on score
  return normalizedRecommendations
    .sort((a, b) => b.score - a.score)
    .map((rec) => rec.item);
}

// Middleware to fetch user-item data and get recommendations
const userItemData = async (req, res, next) => {
  const users = req.users; // users
  const products = await product.find(); // products
  const reviews = products.map((product) => product.reviews).flat();

  const userItemData = users.map((user) => {
    const interactions = {};
    reviews
      .filter((review) => review.user.toString() === user._id.toString())
      .forEach((review) => {
        const product = products.find((product) =>
          product.reviews.some(
            (r) => r._id.toString() === review._id.toString()
          )
        );
        if (product) {
          interactions[product._id] = review.rating;
        }
      });

    return {
      userId: user._id,
      interactions,
    };
  });

  // console.log(userItemData);
  req.userItemData = userItemData;
  next();
};

// Middleware to get recommendations
const getRecommendation = (req, res) => {
  const targetUserId = req.params.userId;
  // console.log(targetUserId);
  const recommendations = getRecommendations(targetUserId, req.userItemData);

  if (recommendations.message) {
    return res.status(404).json({ message: recommendations.message });
  }

  res.json({ userId: targetUserId, recommendations });
};

module.exports = {
  userItemData,
  getRecommendation,
};
