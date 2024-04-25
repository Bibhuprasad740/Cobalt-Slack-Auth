const axios = require("axios");

exports.signin = async (req, res, next) => {
  const scopes = "channels:read";
  console.log("request here...");
  res.redirect(
    `https://slack.com/oauth/v2/authorize?scope=${encodeURIComponent(
      scopes
    )}&client_id=${
      process.env.SLACK_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(process.env.SLACK_REDIRECT_URL)}`
  );
  //   res.redirect(
  //     `https://slack.com/oauth/v2/authorize?client_id=${
  //       process.env.SLACK_CLIENT_ID
  //     }&user_scope=${encodeURIComponent(
  //       scopes
  //     )}&redirect_uri=${encodeURIComponent(process.env.SLACK_REDIRECT_URL)}`
  //   );
};

exports.getDataFromSlack = async (req, res) => {
  const { code } = req.query;

  try {
    const tokneResponse = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          code,
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          redirect_uri: process.env.SLACK_REDIRECT_URL,
        },
      }
    );

    console.log("Token response: ", tokneResponse.data);

    if (tokneResponse.data.ok) {
      console.log(tokneResponse.data);
      const accessToken = tokneResponse.data.authed_user.access_token;
      req.session.slack_access_token = accessToken;
      req.session.slack_user_id = tokneResponse.data.authed_user.id;

      const channelsResponse = await axios.get(
        "https://slack.com/api/conversations.list",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Chennel response: ", channelsResponse.data);

      if (channelsResponse.data.ok) {
        const channels = channelsResponse.data.channels
          .map((channel) => channel.name)
          .join(", ");

        res.send(`Authorization successful. ${channels}`);
      } else {
        console.log(channelsResponse.data.error);
        res.status(500).send("Error in fetching channelsss!");
      }
    } else {
      console.log(channelsResponse.data.error);
      res.status(500).send("Error fetcing token!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting data from slack!");
  }
};
