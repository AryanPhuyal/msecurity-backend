const randomSn = (): string => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

  for (var i = 0; i < 15; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const randomLicense = (): string => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

const randomKeyTool = {
  randomSn,
  randomLicense,
};

export default randomKeyTool;
