import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

/* TODO::
    Add the ability to reply to a specific tweet. //!Done
    Save tweets, likes and retweets to localStorage.
    Allow a user to delete a tweet.
*/

let trueTweetsData = [];

let tweetsDataFromLocalStorage = JSON.parse(localStorage.getItem("tweetsData"));
if (tweetsDataFromLocalStorage) {
  trueTweetsData = tweetsDataFromLocalStorage;
} else {
  trueTweetsData = tweetsData;
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.addComment) {
    handleAddCommentClick(e.target.dataset.addComment);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = trueTweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  localStorage.setItem("tweetsData", JSON.stringify(trueTweetsData));
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = trueTweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  localStorage.setItem("tweetsData", JSON.stringify(trueTweetsData));
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    trueTweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    tweetInput.value = "";
    render();
  }
}

function handleAddCommentClick(commentId) {
  const commentInput = document.getElementById(`tweet-input-${commentId}`);
  const targetTweetObj = trueTweetsData.filter(function (tweet) {
    return tweet.uuid === commentId;
  })[0];
  if (commentInput.value) {
    targetTweetObj.replies.push({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: commentInput.value,
    });
    commentInput.value = "";
    localStorage.setItem("tweetsData", JSON.stringify(trueTweetsData));
    render();
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  trueTweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
            </div>
        `;
      });
    }
    repliesHtml += `
        <br>
        <div class="tweet-input-area">
            <img src="images/scrimbalogo.png" class="profile-pic" />
            <textarea placeholder="....." id="tweet-input-${tweet.uuid}"></textarea>
        </div>
        <button data-add-comment="${tweet.uuid}">Reply</button>
      `;

    feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>
                </div>
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>
        </div>
    `;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
