const validateResponse = (res) => typeof res === "object" && res.status;

const updateSS = async (data, ssUrl) => {
  const request = require("request-promise");
  const options = {
    uri: ssUrl,
    headers: { "Content-type": "application/json" },
    json: data,
    followAllRedirects: true,
  };

  return request
    .post(options)
    .then((res) => {
      console.log("ok res: ", res);
      if (!validateResponse(res)) {
        throw new Error("スプシからのJsonが不正です");
      }
      return res;
    })
    .catch((error) => {
      console.log("error res: ", error);
      throw new Error(error);
    });
};

const studyStart = async (at, userId, userName, ssUrl) => {
  const jsonData = {
    type: "start",
    at,
    userId,
    userName,
  };
  return updateSS(jsonData, ssUrl);
};

const studyEnd = async (at, userId, userName, ssUrl) => {
  const jsonData = {
    type: "end",
    at,
    userId,
    userName,
  };
  return updateSS(jsonData, ssUrl);
};

const studyReport = async (userId, ssUrl) => {
  const jsonData = {
    type: "report",
    userId,
  };
  return updateSS(jsonData, ssUrl);
};

exports.studyStart = studyStart;
exports.studyEnd = studyEnd;
exports.studyReport = studyReport;
