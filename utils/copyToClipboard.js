import copy from "copy-to-clipboard";
import showAlert from "@/services/commonservice/AlertService";

const copyToClipboard = (text) => {
  const copyText = text;
  copy(copyText);
  showAlert("success", "Copied to clipboard");
};

export default copyToClipboard;
