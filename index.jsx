export const refreshFrequency = 10000; // ms

const theme = {
  borderSize: 0,
  thickness: "2px",
  green: [128, 188, 79],
  red: [224, 108, 117],
  screenSize: window.innerWidth
};

const computeUsedBattery = usedPercentage => {
  const paddingPercent = (100 - usedPercentage) / 2;
  return theme.screenSize * (paddingPercent / 100);
};
const computeBatteryColor = level => {
  const {green, red} = theme;
  return colorMixer(green, red, level);
};

// https://stackoverflow.com/a/32171077
//colorChannelA and colorChannelB are ints ranging from 0 to 255
const colorChannelMixer = (colorChannelA, colorChannelB, amountToMix) => {
  amountToMix /= 100;
  var channelA = colorChannelA * amountToMix;
  var channelB = colorChannelB * (1 - amountToMix);
  return parseInt(channelA + channelB);
}

//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
const colorMixer = (rgbA, rgbB, amountToMix) => {
  var r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  var g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  var b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  console.log("rgb(" + r + "," + g + "," + b + ")");
  return "rgb(" + r + "," + g + "," + b + ")";
}

const getBarStyle = batteryPercentage => {
  const height = theme.thickness;
  const background = computeBatteryColor(batteryPercentage);
  const borderSize = theme.borderSize + computeUsedBattery(batteryPercentage);

  return {
    top: "32px",
    right: borderSize,
    left: borderSize,
    position: "fixed",
    background,
    overflow: "hidden",
    height
  };
};

export const command = `pmset -g batt | egrep '(\\d+)\%' -o | cut -f1 -d%`;

export const render = ({ output, error }) => {
  if (error) {
    console.error(error);
  }

  const batteryPercentage = parseInt(output);
  const barStyle = getBarStyle(batteryPercentage);

  return <div style={barStyle} />;
};
