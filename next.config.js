module.exports = {
    env: {
        REACT_APP_FIREBASE_KEY: "AIzaSyCwMpdAnu5Rf0hB88obh25SPtymSeRwbMA",
        REACT_APP_FIREBASE_DOMAIN: "tweetcast.firebaseapp.com",
        REACT_APP_FIREBASE_DATABASE: "https://tweetcast-default-rtdb.firebaseio.com/",
        REACT_APP_FIREBASE_PROJECT_ID: "tweetcast",
        REACT_APP_FIREBASE_STORAGE_BUCKET: "tweetcast.appspot.com",
        GOOGLE_CLIENT_ID: "499314077621-n7klfql9rfd8ho7kl26bu6p1vf9fgg5h.apps.googleusercontent.com",
        consumerKey: "KFhRrUOgwJN6DZswK3JmLLAPh",
        consumerSecret: "vxYwy0hnrqmitB2ur48StbKYPTU5RbmQUshzSscU9ojotjcmjh",
        acessToken: "2567443994-mgLJsYk2LH5MB0zIrV5KqIzuPoBcha76CpOCE8j",
        tokenSecret: "ffY4pdaFzquwlpfX55NbCHjxtCmmvFFlzR2oAQ2q3ffc8",
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAB5kMAEAAAAAFk4%2BKwlL9ea%2BlZE5KSjOYpk9Vco%3DjjIP34iq41pL0Xno93YK9f9fgbCusFlP8IMrXF9pSxiFDwGOtl",
        prodDomain: 'https://tweet-cast.vercel.app',
        devDomain: 'http://localhost:3000/',

        async headers() {
            return [
              {
                // matching all API routes
                source: ["/api/(.*)", "https://api.twitter.com/1.1/statuses/show.json?" ],
                headers: [
                  { key: "Access-Control-Allow-Credentials", value: "true" },
                  { key: "Access-Control-Allow-Origin", value: "*" },
                  { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
              }
            ]
        }
    },
}