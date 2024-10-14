function showRequirements(system) {
  // 모든 요구사항 숨기기
  document.getElementById("windows").style.display = "none";
  document.getElementById("mac").style.display = "none";
  document.getElementById("linux").style.display = "none";

  // 선택된 요구사항 표시
  document.getElementById(system).style.display = "block";

  // 모든 탭에서 active 클래스 제거
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // 클릭된 탭에 active 클래스 추가
  event.target.classList.add("active");
}
