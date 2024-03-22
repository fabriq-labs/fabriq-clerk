
import moment from "moment";
import "moment-timezone";


export const formatDuration = (duration:any, textFontSize:any, numberFontSize: any) => {
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
  
    if (hours > 0) {
      return (
        <span>
          <span style={{ fontSize: numberFontSize }}>
            {hours.toLocaleString()}
          </span>
          <span style={{ fontSize: textFontSize, fontWeight: "500" }}>h</span>{" "}
          <span style={{ fontSize: numberFontSize, marginLeft: "5px" }}>
            {minutes}
            <span style={{ fontSize: textFontSize, fontWeight: "500" }}>m</span>
          </span>
        </span>
      );
    } else if (minutes > 0) {
      return (
        <span>
          <span style={{ fontSize: numberFontSize }}>
            {minutes}
            <span style={{ fontSize: textFontSize, fontWeight: "500" }}>m</span>
          </span>
        </span>
      );
    } else {
      return (
        <span>
          <span style={{ fontSize: numberFontSize }}>
            {duration.seconds()}
            <span style={{ fontSize: textFontSize, fontWeight: "500" }}>s</span>
          </span>
        </span>
      );
    }
  };
  