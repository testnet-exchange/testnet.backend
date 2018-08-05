import request from 'request-promise'
//
// const CLIENT_ID = '7X3ag7jzq3cwgQ'
// const CLIENT_SECRET = 'l5LST_4c_GCDBSL2ypIjc__XKm8'
export const getUser = (accessToken) =>
  request({
    uri: 'https://oauth.reddit.com/api/v1/me',
    json: true,
    qs: {
      access_token: accessToken,
      fields: 'id, name, email, picture'
    }
  }).then(({ id, name, email, picture }) => ({
    service: 'facebook',
    picture: picture.data.url,
    id,
    name,
    email
  }))
