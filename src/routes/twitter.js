import { Router } from 'express';

const Twit = require('twit');
const router = Router();
const {Tweets} = require('../../database/models');

const T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_OAUTH_TOKEN,
    access_token_secret:  process.env.TWITTER_OAUTH_TOKEN_SECRET,
});

router.get('/searchByUser/:userHandle/:query?', async (req, res) => {
    const queryString = req.params.query;
    const userHandle = req.params.userHandle;
    let userTweets = [];
    try {
        let userData = await getTweetsByUser(userHandle);
        if(userData){
            await Tweets.create({
                text:"User Handle: "+userHandle,
                data:JSON.stringify(userData)
            });
            userData.forEach((item) => {
                if(queryString){
                    if(item.text.toLowerCase().includes(queryString.toLowerCase())) {
                        userTweets.push({
                            id: item.id,
                            text: item.text,
                            created_at: item.created_at
                        });
                    }
                }else{
                    userTweets.push({
                        id: item.id,
                        text: item.text,
                        created_at: item.created_at
                    });
                }
            });
        }
    }catch (e) {
        console.log("error users"+e);
    }
    res.send(userTweets);
});
router.get('/:query', async (req, res) => {
    const queryString = req.params.query;
    let responseData = [];
    try {
        let tweetData = await getTweetsByQueryString(queryString);
        if (tweetData.statuses) {
            let tweets = tweetData.statuses;
            await Tweets.create({
                text:"Query String: "+queryString,
                data:JSON.stringify(tweets)
            });
            tweets.forEach((item) => {
                responseData.push({
                    id: item.id,
                    text: item.text,
                    created_at: item.created_at
                })
            });
        }
    }catch (e) {
        console.log("error"+e);
    }
    res.send(responseData);
});

async function getTweetsByQueryString(query, count = 10) {
    return new Promise((resolve, reject) => {
        T.get('search/tweets', { q: query, count: count }, function(err, data, response) {
            err ? reject(err): resolve(data);
        }) ;
    });
}

async function getTweetsByUser(screenName) {
    return new Promise((resolve, reject) => {
        T.get('statuses/user_timeline', { screen_name: screenName }, function(err, data, response) {
            err ? reject(err): resolve(data);
        }) ;
    });
}

export default router;
