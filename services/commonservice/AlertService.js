let iconClasses = "";
let bgColor = "";
let iconPath = "";

export const showAlert = (type, message) => {
  // Check if there is  existing alert and remove it
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Set the appropriate styles and icon path based on the alert type
  if (type === "success") {
    bgColor = "bg-green-600";
    iconClasses = "text-green-200";
    iconPath = "M5 13l4 4L19 7";
  } else if (type === "error") {
    bgColor = "bg-red-600";
    iconClasses = "text-red-200";
    iconPath = "M6 18L18 6M6 6l12 12";
  }

  // Create the new alert element
  const subscriptionelement = document.getElementById("Subscription");
  const alertElement = document.createElement("div");
  alertElement.className = "custom-alert z-50";
  alertElement.innerHTML = `
    <div class="rounded-md px-4 py-2 shadow-md flex items-center ${bgColor} text-white z-50">
        <svg id="alertSvg" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 ${iconClasses}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}" />
        </svg>
        <span>${message}</span>
    </div>
  `;
  subscriptionelement.appendChild(alertElement);

  // Add click event to remove the alert on SVG click
  const alertSvg = alertElement.querySelector("#alertSvg");
  alertSvg.addEventListener("click", () => {
    alertElement.remove();
  });

  // Set timeout to remove the alert after 4 seconds
  setTimeout(() => {
    alertElement.remove();
  }, 4000);
};

export default showAlert;
