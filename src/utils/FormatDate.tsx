interface IFormatDate {
  date: string;
}
interface IFormatTime {
  time: string;
}

export const FormatDate = ({ date }: IFormatDate) => {
  const options: any = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  //   for time
  const timeOptions: any = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-GB", options);
};

export const FormatTime = ({ time }: IFormatTime) => {
  const timeOptions: any = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(time).toLocaleTimeString("en-GB", timeOptions);
};
