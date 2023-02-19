import React from "react";

function usePageTitle(title = "") {
  React.useEffect(() => {
    document.title = title ? title + " - Schedule Maker" : "Schedule Maker";
  }, [title]);
}

export default usePageTitle;
