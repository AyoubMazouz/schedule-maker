import React from "react";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { IcEx } from "../helpers/icons";

interface AlertType {
  type: "success" | "warn" | "danger";
  message: string;
}

const style: any = {
  success: "bg-emerald-500 text-white border-emerald-800",
  warn: "bg-amber-500 text-white border-yellow-700",
  danger: "bg-red-500 text-white border-rose-800",
};

const Alert = () => {
  const { alerts, setAlerts } = useGlobalContext();

  React.useEffect(() => {
    const unsubscribe = setTimeout(() => {
      if (alerts.length > 0) setAlerts(alerts.slice(1, alerts.length));
    }, 5000);
    return () => clearTimeout(unsubscribe);
  }, [alerts]);

  const handleClearAlert = (index: number) =>
    setAlerts((x: AlertType[]) => x.filter((_, i) => i !== index));

  return (
    <div className="fixed bottom-0 left-0 z-50 max-w-[800px] space-y-2 p-4">
      {alerts.map((alert: AlertType, index: number) => (
        <div
          key={`${alert.message}${index}`}
          className={`${
            style[alert.type]
          } relative rounded-md border-[1px] py-2 px-12`}
        >
          <div>{alert.message}</div>
          <button
            className="absolute top-[50%] left-0 translate-y-[-50%] translate-x-[50%] cursor-pointer"
            onClick={() => handleClearAlert(index)}
          >
            <IcEx className="icon transition-all duration-300 hover:rotate-180 hover:scale-110 hover:opacity-50" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Alert;
