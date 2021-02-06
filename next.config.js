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
        acessToken: "2567443994-eRKcEIqibJFXXQa2PTkVJKC92beE7Fl3O4OmXBR",
        tokenSecret: "N79T2Idnvsx80g5tFyQABGkmZUrK48oVuRy5f9T1rrfBx",
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAB5kMAEAAAAApV5aHufg6LWzJ2xotnsiKZO1ZVk%3DXSDfLdcSjMtEk1PtjPjA36eWJgLibw4DT8RzIKTKz1sXUht99i"
    },
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
          config.node = {
            fs: 'empty'
          }
        }
        return config
    }
}