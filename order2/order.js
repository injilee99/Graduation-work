function confirmPurchase() {
  if (confirm("구매를 확정하시겠습니까?")) {
    const buttonContainer = document.getElementById("action-buttons");
    buttonContainer.innerHTML = `<button class="confirmcomplete-btn">구매확정 완료</button>`;

    const productItems = document.querySelectorAll(".product-item");
    productItems.forEach((item) => {
      const reviewBtn = document.createElement("button");
      reviewBtn.className = "review-btn";
      reviewBtn.innerText = "리뷰쓰기";
      item.appendChild(reviewBtn);
    });
  }
}
