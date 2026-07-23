export function getProductReviewSummary(product) {
  const apiRating = Number(product?.rating || 0);
  const apiCount = Number(
    product?.reviewCount ||
    product?.reviewsCount ||
    0
  );

  if (apiCount > 0) {
    return {
      rating: apiRating,
      count: apiCount
    };
  }

  try {
    const reviews = JSON.parse(
      localStorage.getItem(`reviews:${product.id}`) || "[]"
    );
    const count = reviews.length;
    const rating = count
      ? reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating || 0),
          0
        ) / count
      : 0;

    return {
      rating,
      count
    };
  } catch {
    return {
      rating: 0,
      count: 0
    };
  }
}
