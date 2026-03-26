import { HiOutlineShare } from "react-icons/hi";
import { useCallback } from "react";

const ShareButton = () => {
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        // ✅ Native share dialog
        await navigator.share({
          title: document.title,
          url,
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        // ✅ Modern clipboard API
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } else {
        // ✅ Fallback method for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div
      onClick={handleShare}
      className="flex items-center gap-3 my-5 cursor-pointer hover:opacity-80"
    >
      <p>Share this product</p>
      <HiOutlineShare size={20} />
    </div>
  );
};

export default ShareButton;
