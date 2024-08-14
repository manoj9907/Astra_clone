const dateFormat = (date) => {
  if (date) {
    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    const formattedDate = `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
    return formattedDate;
  }

  return "";
};

export default dateFormat;
