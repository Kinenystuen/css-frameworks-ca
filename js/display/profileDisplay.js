import { fetchData } from "../api/feed.js";
import { clearHTML } from "../utils/clearHTML.js";

const profileContainer = document.getElementById("profileContainer");
const postsNumber = document.getElementById("posts");

export async function displayProfile(data) {
  clearHTML(profileContainer);

  // Sort the date by date order
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Author id, post count, comments
  const authorID = 1;
  let postCount = 0;
  let comments = 0;

  const blogPosts = data[0].blogPosts;
  const users = data[0].users;

  // sort the posts by date
  blogPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
  blogPosts.reverse().forEach((object) => {
    // Find author
    const authorId = object.authorId;
    const author = users.find((user) => user.id === authorId);
    const postId = object.id;

    if (authorId !== authorID) {
      return;
    }
    postCount++;

    // Number of posts
    postsNumber.innerHTML = postCount.toString();

    const formattedDate = new Date(object.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const hr = document.createElement("hr");
    const hr2 = document.createElement("hr");

    // The card
    const card = document.createElement("article");
    card.classList.add("card", "position-relative", "m-4");

    // Body elements to the card
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Profile
    const userInfo = document.createElement("div");
    userInfo.classList.add("d-flex", "align-items-center", "gap-2");
    const userImg = document.createElement("img");
    userImg.classList.add("rounded-circle", "me-2", "object-fit-cover");
    userImg.setAttribute("width", "32 ");
    userImg.setAttribute("height", "32");
    userImg.alt = `User image for ${object.name}`;
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("d-flex", "row");
    const userName = document.createElement("strong");
    const textMuded = document.createElement("small");
    textMuded.classList.add("text-muted");
    textMuded.innerHTML = `Published: ${formattedDate}`;

    if (author) {
      userName.innerText = author.name;
      userImg.src = author.profileImg;
    } else {
      userName.innerText = "Anonym";
      userImg.src = object.image;
    }

    nameDiv.appendChild(userName);
    nameDiv.appendChild(textMuded);
    userInfo.appendChild(userImg);
    userInfo.appendChild(nameDiv);

    // Title and content
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerHTML = object.title;
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerHTML = object.content;

    const cardText2 = document.createElement("p");
    cardText2.classList.add("card-text");

    cardBody.appendChild(userInfo);
    cardBody.appendChild(hr);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardText2);

    // Image elements
    const feedImg = document.createElement( "img");
    feedImg.src = object.image;
    feedImg.alt = `Image for ${object.title} post by ${object.name}`;
    feedImg.classList.add("img-fluid");
    const feedImgArea = document.createElement("div");
    feedImgArea.classList.add(
      "overflow-hidden",
      "vh-80",
      "d-flex",
      "object-fit-contain",
      "justify-content-center",
      "align-content-center"
    );
    // If image fail to load, remove viewpoint height
    feedImg.onerror = function() {
      feedImgArea.classList.remove("vh-80");
    };

    // Action area
    const actionsArea = document.createElement("div");
    const actions = document.createElement("div");
    const cmtBtn = document.createElement("button");
    const favoriteBtn = document.createElement("button");
    const favoriteI = document.createElement("i");
    const shareBtn = document.createElement("button");

    actions.classList.add(
      "d-flex",
      "justify-content-center",
      "btn-group",
      "mt-3"
    );
    actions.setAttribute("role", "group");
    actions.setAttribute("aria-label", "outline");

    comments = object.comments.length;

    cmtBtn.classList.add("btn", "btn-outline-primary");
    cmtBtn.innerHTML = `Comments: ${comments}`;
    cmtBtn.type = "button";
    cmtBtn.setAttribute("data-bs-toggle", "collapse");
    cmtBtn.setAttribute("data-bs-target", `#showComments-${object.id}`);
    cmtBtn.setAttribute("aria-expanded", "false");
    cmtBtn.setAttribute("aria-controls", `showComments-${object.id}`);

    favoriteBtn.classList.add("btn", "btn-outline-primary");
    favoriteBtn.title = "Favorite";
    favoriteI.classList.add("fa-regular", "fa-heart");
    favoriteBtn.addEventListener("click", function () {
      favoriteI.classList.toggle("fa-regular");
      favoriteI.classList.toggle("fa-solid");
    });
    favoriteBtn.appendChild(favoriteI);

    shareBtn.classList.add("btn", "btn-outline-primary");
    shareBtn.title = "Share post";
    const shareI = document.createElement("i");
    shareI.classList.add("fa-solid", "fa-share");
    shareBtn.appendChild(shareI);

    actions.appendChild(cmtBtn);
    actions.appendChild(favoriteBtn);
    actions.appendChild(shareBtn);
    actionsArea.appendChild(actions);

    // comments area
    const commentArea = document.createElement("div");
    commentArea.classList.add("d-flex", "justify-content-center", "row");

    const commentsDiv = document.createElement("div");
    commentsDiv.classList.add("collapse");
    commentsDiv.id = `showComments-${object.id}`;
    const commentsP = document.createElement("div");
    commentsP.classList.add("card-body", "bg-body-tertiary");
    commentsP.id = `commentArea-${postId}`;

    commentsDiv.appendChild(commentsP);
    commentArea.appendChild(commentsDiv);
    actionsArea.appendChild(commentArea);

    // Appending all the elements to the card element
    feedImgArea.appendChild(feedImg);
    card.appendChild(cardBody);
    if (object.image.trim() !== "") {
      card.appendChild(feedImgArea);
    }   
    card.appendChild(actionsArea);
    profileContainer.appendChild(card);

    // Fetch comments
    displayComments(object, users, postId);
  });
}

export async function displayComments(object, users, postId) {
  // Comments section
  const commentArea = document.getElementById(`commentArea-${postId}`);

  // Assuming this code is within a function that receives 'object', 'users', and 'commentsP' as parameters
  object.comments.forEach((comment) => {
    const formattedDate = new Date(comment.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const commentElementArea = document.createElement("div");
    const commentProfile = document.createElement("div");
    const commentUserImg = document.createElement("img");
    const commentProfileText = document.createElement("div");
    const commentUser = document.createElement("strong");
    const commentDate = document.createElement("small");
    const commentFav = document.createElement("i");
    const commentReply = document.createElement("i");
    const isReply = comment.parent !== 0;

    commentElementArea.classList.add("card", "p-2", "m-2");
    commentElementArea.id = "comment-" + comment.commentId;
    commentProfile.classList.add("d-flex", "align-content-center","w-100");
    commentProfileText.classList.add("d-flex", "flex-column", "w-100");
    commentDate.textContent = `${formattedDate}`;
    const commentElement = document.createElement("p");
    commentElement.classList.add("ps-3", "mt-2");
    commentElement.textContent = comment.comment;
    commentUserImg.classList.add(
      "rounded-circle",
      "m-2",
      "object-fit-cover",
      "align-content-center",
      "flex-shrink-0"
    );
    commentUserImg.setAttribute("width", "32");
    commentUserImg.setAttribute("height", "32");
    commentReply.classList.add(
      "fa-solid",
      "fa-reply"
    );
    commentReply.title = "Reply";

    // Find comment author name
    const cmtAuthorId = comment.cmtAuthorId;
    const cmtAuthor = users.find((user) => user.id === cmtAuthorId);
    if (cmtAuthor) {
      commentUser.innerText = cmtAuthor.name;
      commentUserImg.src = cmtAuthor.profileImg;
    } else {
      commentUser.innerText = "Unknown";
      console.log(object);
    }
    if (!cmtAuthor.profileImg) {
      commentUserImg.src = "/../img/user-solid.svg";
      commentUserImg.classList.add("border", "p-1");
      commentUserImg.classList.replace(
        "object-fit-cover",
        "object-fit-contain"
      );
    }

    // Favorite comment
    commentFav.classList.add("fa", "fa-heart", "fa-regular", "ps-3");
    commentFav.title = "Favorite";
    commentFav.addEventListener("click", function () {
      commentFav.classList.toggle("fa-regular");
      commentFav.classList.toggle("fa-solid");
    });
    commentProfile.appendChild(commentUserImg);
    commentProfileText.appendChild(commentUser);
    commentProfileText.appendChild(commentDate);
    commentProfile.appendChild(commentProfileText);
    commentElementArea.appendChild(commentProfile);
    // commentElementArea.appendChild(commentUser);
    // commentElementArea.appendChild(commentDate);
    commentElementArea.appendChild(commentElement);
    commentElementArea.appendChild(commentFav);

    // Check if there is a parent comment
    if (isReply) {
      const parentId = "comment-" + comment.parent;
      const parentCommentDiv = document.getElementById(parentId);
      if (parentCommentDiv) {
        commentElementArea.classList.remove("card", "p-2", "m-2");
        commentElementArea.classList.add("border-top", "ps-4","pt-1", "m-2");
        
        parentCommentDiv.appendChild(commentElementArea);
      } else {
        console.error("Parent comment div not found for comment:", comment);
      }
    } else {
      commentProfile.appendChild(commentReply);
      commentArea.appendChild(commentElementArea);
    }
  });
  const newCmt = document.createElement("button");
  newCmt.classList.add("btn", "btn-outline-primary", "m-2");
  newCmt.innerHTML = "Comment";
  commentArea.appendChild(newCmt);
}
